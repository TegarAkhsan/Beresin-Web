import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Hero from '@/Components/Landing/Hero';
import Services from '@/Components/Landing/Services';
import HowItWorks from '@/Components/Landing/HowItWorks';
import Features from '@/Components/Landing/Features';
import FAQ from '@/Components/Landing/FAQ';
import CTA from '@/Components/Landing/CTA';
import Footer from '@/Components/Landing/Footer';

export default function Welcome({ auth, canLogin, canRegister, services, whatsapp_number }) {
    return (
        <>
            <Head title="Beresin - Solusi Jasa Digital" />
            <div className="bg-slate-900 min-h-screen text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">

                <Navbar auth={auth} canLogin={canLogin} canRegister={canRegister} />

                <main>
                    <Hero />
                    <Services services={services} auth={auth} whatsappNumber={whatsapp_number} />
                    <HowItWorks />
                    <Features />
                    <FAQ />
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
