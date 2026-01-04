<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    // Customer: Get own messages
    public function index()
    {
        return Chat::where('user_id', Auth::id())
            ->orderBy('created_at', 'asc')
            ->get();
    }

    // Customer: Send message
    public function store(Request $request)
    {
        $request->validate(['message' => 'required|string']);

        $chat = Chat::create([
            'user_id' => Auth::id(),
            'message' => $request->message,
            'is_admin_reply' => false,
        ]);

        // Auto-reply for every message (as requested)
        Chat::create([
            'user_id' => Auth::id(),
            'message' => 'Pesan dalam antrian dengan kode pesan #' . $chat->id . ' harap tunggu hingga admin menjawab.',
            'is_admin_reply' => true,
        ]);

        return response()->json($chat);
    }

    // Admin: List all conversations (users who have chatted)
    public function adminIndex()
    {
        // Get users with their latest chat message
        $users = User::whereHas('chats')
            ->with([
                'chats' => function ($query) {
                    $query->latest()->limit(1);
                }
            ])
            ->get()
            ->map(function ($user) {
                $user->last_message = $user->chats->first();
                $user->unread_count = $user->chats->where('is_read', false)->where('is_admin_reply', false)->count();
                return $user;
            })
            ->sortByDesc('last_message.created_at')
            ->values();

        return Inertia::render('Admin/Chat/Index', [
            'conversations' => $users
        ]);
    }

    // Admin: Get specific conversation
    public function adminShow(User $user)
    {
        // Mark as read
        Chat::where('user_id', $user->id)
            ->where('is_admin_reply', false)
            ->update(['is_read' => true]);

        $messages = Chat::where('user_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    // Admin: Reply to user
    public function adminStore(Request $request, User $user)
    {
        $request->validate(['message' => 'required|string']);

        $chat = Chat::create([
            'user_id' => $user->id,
            'message' => $request->message,
            'is_admin_reply' => true,
        ]);

        return response()->json($chat);
    }
}
