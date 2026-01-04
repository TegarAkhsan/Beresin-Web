import { Head, usePage } from '@inertiajs/react'; // Added usePage
import Navbar from '@/Components/Landing/Navbar';
import Hero from '@/Components/Landing/Hero';
import Services from '@/Components/Landing/Services';
import HowItWorks from '@/Components/Landing/HowItWorks';
import Features from '@/Components/Landing/Features';
import FAQ from '@/Components/Landing/FAQ';
import CTA from '@/Components/Landing/CTA';
import Footer from '@/Components/Landing/Footer';
import Asterisk from '@/Components/Landing/Asterisk';
import Modal from '@/Components/Modal'; // Import Modal
import PrimaryButton from '@/Components/PrimaryButton'; // Import PrimaryButton
import SecondaryButton from '@/Components/SecondaryButton'; // Import SecondaryButton
import { useState, useEffect } from 'react'; // Import hooks
import Testimonials from '@/Components/Landing/Testimonials'; // Import Testimonials
import ChatWidget from '@/Components/ChatWidget'; // Import ChatWidget
import { Link } from '@inertiajs/react'; // Import Link for the modal button

export default function Welcome({ auth, canLogin, canRegister, services, whatsapp_number, footer_settings }) {
    const { flash } = usePage().props;
    const [showDashboardPrompt, setShowDashboardPrompt] = useState(false);

    useEffect(() => {
        // Only show if flash prompt exists AND we haven't shown it recently (session check)
        // Actually, to be safer for "Back" button, we trust the session storage more.
        if (flash?.show_dashboard_prompt) {
            const hasSeen = sessionStorage.getItem('welcome_modal_shown_session_' + auth?.user?.id);
            if (!hasSeen) {
                setShowDashboardPrompt(true);
                sessionStorage.setItem('welcome_modal_shown_session_' + auth?.user?.id, 'true');
            }
        }
    }, [flash, auth]);

    return (
        <>
            <Head title="Beresin - Solusi Jasa Digital" />
            <div className="bg-[#F3F3F1] min-h-screen text-slate-900 font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden">

                <Navbar auth={auth} canLogin={canLogin} canRegister={canRegister} />

                {/* Dashboard Prompt Modal - Dark Theme */}
                <Modal show={showDashboardPrompt} onClose={() => setShowDashboardPrompt(false)} maxWidth="md">
                    <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>

                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl rotate-3 flex items-center justify-center shadow-2xl mb-6 relative z-10">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-2 relative z-10 tracking-tight">
                            Welcome Back!
                        </h2>

                        <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs mb-6 relative z-10">
                            {auth?.user?.name || 'CHAMPION'}
                        </p>

                        <p className="text-slate-400 mb-8 relative z-10 leading-relaxed">
                            You have successfully logged in.<br />
                            Ready to level up your project?
                        </p>

                        <div className="flex flex-col gap-3 relative z-10">
                            <Link
                                href={route('dashboard')}
                                className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition shadow-lg hover:shadow-xl hover:-translate-y-1 block"
                            >
                                GO TO DASHBOARD &rarr;
                            </Link>
                            <button
                                onClick={() => setShowDashboardPrompt(false)}
                                className="text-slate-500 hover:text-white text-sm font-medium py-2 transition"
                            >
                                Stay on Homepage
                            </button>
                        </div>
                    </div>
                </Modal>

                <main className="relative">
                    <Hero auth={auth} />

                    {/* ... existing content ... */}

                    {/* Decor between Hero & Features */}
                    <div className="relative h-0 w-full max-w-7xl mx-auto z-20 pointer-events-none">
                        <Asterisk className="absolute -top-16 right-6 md:right-32 w-24 h-24 text-slate-900/10 animate-spin-slow" />
                        <Asterisk className="absolute top-10 left-6 md:left-20 w-12 h-12 text-slate-900/20" />
                    </div>

                    <Features />

                    {/* Decor between Features & Services */}
                    <div className="relative h-0 w-full max-w-7xl mx-auto z-20 pointer-events-none">
                        <Asterisk className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 text-slate-900/5 animate-spin-slow" />
                    </div>

                    <Services services={services} auth={auth} whatsappNumber={whatsapp_number} />

                    {/* Decor between Services & HowItWorks */}
                    <div className="relative h-0 w-full max-w-7xl mx-auto z-20 pointer-events-none">
                        <Asterisk className="absolute -top-12 left-10 w-20 h-20 text-yellow-500/80 animate-spin-slow" />
                        <Asterisk className="absolute top-20 right-10 w-16 h-16 text-slate-900/10" />
                    </div>

                    <HowItWorks />

                    {/* Decor between HowItWorks & Testimonials */}
                    <div className="relative h-0 w-full max-w-7xl mx-auto z-20 pointer-events-none">
                        <Asterisk className="absolute -top-8 right-1/4 w-28 h-28 text-slate-900/5 animate-spin-slow" />
                        <Asterisk className="absolute top-32 left-10 w-12 h-12 text-yellow-500/20" />
                    </div>

                    <Testimonials />

                    {/* Decor between Testimonials & FAQ */}
                    <div className="relative h-0 w-full max-w-7xl mx-auto z-20 pointer-events-none">
                        <Asterisk className="absolute -top-16 left-1/2 w-20 h-20 text-indigo-500/10 animate-spin-slow" />
                    </div>

                    <FAQ />

                    {/* Decor between FAQ & CTA */}
                    <div className="relative h-0 w-full max-w-7xl mx-auto z-20 pointer-events-none">
                        <Asterisk className="absolute -top-16 left-20 w-14 h-14 text-slate-900/20" />
                        <Asterisk className="absolute -bottom-10 right-20 w-24 h-24 text-white/20 animate-spin-slow" />
                    </div>

                    <CTA />
                </main>

                <Footer settings={footer_settings} />

                {/* Chat Widget */}
                <ChatWidget auth={auth} />
            </div>

            <style>{`
                .animate-blob { animation: blob 10s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s ease-out forwards;
                }
                @keyframes float {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                /* Custom text outline */
                .text-stroke {
                    -webkit-text-stroke: 1px rgba(0,0,0,0.1);
                    color: transparent;
                }
            `}</style>
        </>
    );
}

