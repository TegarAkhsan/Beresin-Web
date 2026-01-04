import { router } from '@inertiajs/react';

const MenuItem = ({ id, label, icon, activeTab, setActiveTab, setIsSidebarOpen }) => (
    <button
        onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
        className={`w-full text-left px-4 py-3.5 flex items-center transition-all duration-200 font-medium rounded-xl group ${activeTab === id
            ? 'bg-indigo-50 text-indigo-600 shadow-sm'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
    >
        <span className={`w-1.5 h-1.5 rounded-full mr-3 transition-colors ${activeTab === id ? 'bg-indigo-600' : 'bg-gray-300 group-hover:bg-gray-400'}`}></span>
        <span className={`mr-3 ${activeTab === id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`}>{icon}</span>
        {label}
    </button>
);

export default function JokiSidebar({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, user }) {
    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col justify-between shadow-[2px_0_20px_rgba(0,0,0,0.02)]`}>
            <div>
                <div className="h-20 flex items-center px-8 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <span className="font-bold text-white text-lg">J</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Joki<span className="text-indigo-600">Space</span></h1>
                    </div>
                </div>

                <nav className="mt-8 px-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Workspace</p>
                    <MenuItem
                        id="dashboard"
                        label="Dashboard"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                    <MenuItem
                        id="tasks"
                        label="Available Tasks"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                    <MenuItem
                        id="completed"
                        label="Completed Tasks"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                    <MenuItem
                        id="earnings"
                        label="My Earnings"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                </nav>
            </div>

            <div className="p-4 border-t border-gray-50 bg-white">
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-bold text-sm">{user.name.charAt(0)}</span>
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">Joki Partner</p>
                    </div>
                </div>
                <button
                    onClick={() => router.post(route('logout'))}
                    className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                >
                    <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
