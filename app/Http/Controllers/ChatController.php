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
        $userId = Auth::id();

        // 1. Check previous message to prevent spamming auto-replies
        // If the user sends multiple messages in a row, we only reply to the first one of the batch.
        $lastMessage = Chat::where('user_id', $userId)
            ->latest()
            ->first();

        // Save the new message
        $chat = Chat::create([
            'user_id' => $userId,
            'message' => $request->message,
            'is_admin_reply' => false,
        ]);

        // If the previous message was from the user (and not admin), do not send another auto-reply.
        // We only send auto-reply if the user is replying to the Admin (or the very first message).
        if ($lastMessage && !$lastMessage->is_admin_reply) {
            return response()->json($chat);
        }

        // 2. Build the Auto-Reply
        // Check if this user has had a "real" conversation with an admin before.
        // We exclude standard auto-reply messages to detect human interaction.
        $hasHumanInteraction = Chat::where('user_id', $userId)
            ->where('is_admin_reply', true)
            ->where('message', 'not like', 'Pesan dalam antrian%')
            ->where('message', 'not like', 'Mohon tunggu%')
            ->exists();

        if ($hasHumanInteraction) {
            // Case: Previously connected (Active/Returning Customer)
            $autoMessage = 'Mohon tunggu hingga admin menjawab. (Pesan otomatis)';
        } else {
            // Case: New Customer / First Time
            // Calculate pseudo-queue number: Count of distinct users with unread messages
            // This includes the current user since we just saved their unread message.
            $queueCount = Chat::where('is_read', false)
                ->where('is_admin_reply', false)
                ->distinct('user_id')
                ->count('user_id');

            $autoMessage = 'Pesan dalam antrian dengan kode pesan #' . $queueCount . ' harap tunggu hingga admin menjawab.';
        }

        Chat::create([
            'user_id' => $userId,
            'message' => $autoMessage,
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
