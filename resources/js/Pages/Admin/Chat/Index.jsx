import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function ChatIndex({ auth, conversations }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Chat Messages</h2>}
        >
            <Head title="Chat Messages" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {conversations.length === 0 ? (
                                <p className="text-gray-500 text-center py-10">No messages yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {conversations.map((user) => (
                                        <div
                                            key={user.id}
                                            className={`p-4 rounded-lg border flex flex-col md:flex-row md:justify-between md:items-center transition hover:bg-slate-50 gap-4 ${user.unread_count > 0 ? 'bg-indigo-50 border-indigo-200' : 'border-gray-200'}`}
                                        >
                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <div className="w-12 h-12 flex-shrink-0 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-bold text-lg text-gray-800 truncate">{user.name}</h3>
                                                    <p className="text-gray-500 text-sm truncate max-w-xs md:max-w-md">
                                                        {user.last_message?.message}
                                                    </p>
                                                    <span className="text-xs text-gray-400 mt-1 block">
                                                        {new Date(user.last_message?.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-3 w-full md:w-auto">
                                                {user.unread_count > 0 && (
                                                    <span className="flex-shrink-0 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full whitespace-nowrap shadow-sm">
                                                        {user.unread_count} New
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => window.dispatchEvent(new CustomEvent('open-admin-chat', { detail: { userId: user.id, userName: user.name } }))}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium whitespace-nowrap shadow-sm transition-colors"
                                                >
                                                    Open Chat
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Chat Modal/Drawer Placeholder - Implementation below */}
            <AdminChatDrawer />
        </AuthenticatedLayout>
    );
}

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function AdminChatDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const handleOpen = (e) => {
            setCurrentUser(e.detail);
            setIsOpen(true);
            fetchMessages(e.detail.userId);
        };
        window.addEventListener('open-admin-chat', handleOpen);
        return () => window.removeEventListener('open-admin-chat', handleOpen);
    }, []);

    const fetchMessages = async (userId) => {
        try {
            const response = await axios.get(route('admin.chat.show', userId)); // Corrected route name if needed, check web.php
            // Wait, in controller I named it 'admin.chat.show'? No, let's check web.php
            // Route::get('/chat/{user}', ...)->name('chat.show'); (Admin group) -> admin.chat.show
            // Yes, prefix('admin') -> name('admin.') -> 'admin.chat.show'
            setMessages(response.data);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        try {
            await axios.post(route('admin.chat.reply', currentUser.userId), { message: newMessage });
            setNewMessage('');
            fetchMessages(currentUser.userId);
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Polling when open
    useEffect(() => {
        if (!isOpen || !currentUser) return;
        const interval = setInterval(() => fetchMessages(currentUser.userId), 3000);
        return () => clearInterval(interval);
    }, [isOpen, currentUser]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)}></div>
            <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col animate-slide-in-right">
                <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
                    <h3 className="font-bold">Chat with {currentUser?.userName}</h3>
                    <button onClick={() => setIsOpen(false)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-3">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`max-w-[80%] rounded-xl p-3 text-sm ${!msg.is_admin_reply ? 'bg-white border border-slate-200 self-start text-slate-800' : 'bg-indigo-600 text-white self-end'}`}>
                            <p>{msg.message}</p>
                            <span className={`text-[10px] block mt-1 ${!msg.is_admin_reply ? 'text-slate-400' : 'text-indigo-200'}`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a reply..."
                        className="flex-1 rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button type="submit" className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
