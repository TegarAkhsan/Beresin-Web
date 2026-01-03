import { router } from '@inertiajs/react';

const MenuItem = ({ id, label, icon, activeTab, setActiveTab, setIsSidebarOpen }) => (
    <button
        onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
        className={`w-full text-left px-6 py-4 flex items-center transition-colors ${activeTab === id
            ? 'bg-gray-100 border-r-4 border-indigo-600 text-indigo-700 font-bold'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
    >
        <span className="mr-3">{icon}</span>
        {label}
    </button>
);

export default function JokiSidebar({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, user }) {
    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col justify-between`}>
            <div>
                <div className="flex items-center justify-center h-20 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">W</div>
                        <h1 className="text-xl font-bold text-gray-800">Workspace</h1>
                    </div>
                </div>

                <nav className="mt-6 space-y-1">
                    <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Menu
                    </div>
                    <MenuItem
                        id="dashboard"
                        label="Dashboard & Active"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                    <MenuItem
                        id="tasks"
                        label="New Tasks"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                    <MenuItem
                        id="earnings"
                        label="Earnings"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                </nav>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="flex items-center min-w-0 gap-3 mb-4 p-2">
                    <div className="rounded-full bg-indigo-100 p-2 text-indigo-600">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate text-indigo-500 font-medium tracking-wide">JOKI PRO</p>
                    </div>
                </div>
                <button
                    onClick={() => router.post(route('logout'))}
                    className="w-full text-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors text-sm font-bold"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Log Out
                </button>
            </div>
        </aside>
    );
}
