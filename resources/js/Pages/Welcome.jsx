import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Hero from '@/Components/Landing/Hero';
import Services from '@/Components/Landing/Services';
import HowItWorks from '@/Components/Landing/HowItWorks';
import Features from '@/Components/Landing/Features';
import FAQ from '@/Components/Landing/FAQ';
import CTA from '@/Components/Landing/CTA';
import Footer from '@/Components/Landing/Footer';
import Asterisk from '@/Components/Landing/Asterisk';

export default function Welcome({ auth, canLogin, canRegister, services, whatsapp_number }) {
    return (
        <>
            <Head title="Beresin - Solusi Jasa Digital" />
            <div className="bg-[#F3F3F1] min-h-screen text-slate-900 font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden">

                <Navbar auth={auth} canLogin={canLogin} canRegister={canRegister} />

                <main className="relative">
                    <Hero />

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

                    {/* Decor between HowItWorks & FAQ */}
                    <div className="relative h-0 w-full max-w-7xl mx-auto z-20 pointer-events-none">
                        <Asterisk className="absolute -top-8 right-1/4 w-28 h-28 text-slate-900/5 animate-spin-slow" />
                    </div>

                    <FAQ />

                    {/* Decor between FAQ & CTA */}
                    <div className="relative h-0 w-full max-w-7xl mx-auto z-20 pointer-events-none">
                        <Asterisk className="absolute -top-16 left-20 w-14 h-14 text-slate-900/20" />
                        <Asterisk className="absolute -bottom-10 right-20 w-24 h-24 text-white/20 animate-spin-slow" />
                    </div>

                    <CTA />
                </main>

                <Footer />
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
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </>
    );
}
