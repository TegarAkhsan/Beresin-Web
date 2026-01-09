<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function check(Request $request)
    {
        $user = Auth::user();
        $response = [
            'unread_chats' => 0,
            'pending_orders' => 0,
            'new_tasks' => 0,
        ];

        if (!$user) {
            return response()->json($response);
        }

        // Logic based on Role
        if ($user->role === 'admin') {
            // 1. Unread Chats (User -> Admin)
            $response['unread_chats'] = Chat::where('is_read', false)
                ->where('is_admin_reply', false)
                ->count();

            // 2. Pending Orders (Waiting Approval)
            $response['pending_orders'] = Order::where('status', 'waiting_approval')->count();

        } elseif ($user->role === 'joki') {
            // 1. Unread Chats (Admin -> Joki) - Future proofing if Joki chat is added
            // Currently Joki might not have direct chat, but let's keep it safe.
            // Assuming simplified chat for now:
            $response['unread_chats'] = Chat::where('user_id', $user->id)
                ->where('is_read', false)
                ->where('is_admin_reply', true)
                ->count();

            // 2. New Tasks (Assigned but not started)
            $response['new_tasks'] = Order::where('joki_id', $user->id)
                ->whereIn('status', ['pending_assignment', 'in_progress']) // 'pending_assignment' shouldn't happen if assigned, but safety check.
                ->whereNull('started_at')
                ->count();

        } elseif ($user->role === 'customer') {
            // 1. Unread Chats (Admin -> Customer)
            $response['unread_chats'] = Chat::where('user_id', $user->id)
                ->where('is_read', false)
                ->where('is_admin_reply', true)
                ->count();
        }

        return response()->json($response);
    }
}
