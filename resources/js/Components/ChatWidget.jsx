import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

export default function ChatWidget({ auth }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { props } = usePage();

    // Poll for messages every 3 seconds if open
    useEffect(() => {
        if (!isOpen || !auth.user) return;

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [isOpen, auth.user]);

    // Listen for custom open event
    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('open-chat', handleOpenChat);
        return () => window.removeEventListener('open-chat', handleOpenChat);
    }, []);

    // Scroll to bottom on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(route('chat.index'));
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsLoading(true);
        try {
            await axios.post(route('chat.store'), { message: newMessage });
            setNewMessage('');
            fetchMessages(); // Refresh immediately
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!auth.user) return null; // Don't show if not logged in

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Box */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-96 animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="font-bold">Admin Support</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
                        {messages.length === 0 ? (
                            <div className="text-center text-slate-400 text-sm mt-10">
                                <p>Belum ada pesan.</p>
                                <p>Tulis pesan untuk memulai chat!</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div kye={msg.id} className={`max-w-[80%] rounded-xl p-3 text-sm ${msg.is_admin_reply ? 'bg-white border border-slate-200 self-start text-slate-800' : 'bg-indigo-600 text-white self-end'}`}>
                                    <p>{msg.message}</p>
                                    <span className={`text-[10px] block mt-1 ${msg.is_admin_reply ? 'text-slate-400' : 'text-indigo-200'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Tulis pesan..."
                            className="flex-1 border-slate-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !newMessage.trim()}
                            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition hover:scale-105 active:scale-95 group relative"
            >
                {/* Notification Dot (Dummy for now, or real if we fetch unread count) */}
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>

                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                )}
            </button>
        </div>
    );
}
