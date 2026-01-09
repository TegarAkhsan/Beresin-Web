import { Link, Head } from '@inertiajs/react';

export default function Error({ status }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status];

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status];

    const colors = {
        503: 'bg-indigo-500',
        500: 'bg-red-500',
        404: 'bg-yellow-400',
        403: 'bg-orange-500',
    }[status] || 'bg-slate-200';

    const textColors = {
        503: 'text-white',
        500: 'text-white',
        404: 'text-black',
        403: 'text-black',
    }[status] || 'text-black';

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${colors} font-sans selection:bg-black selection:text-white`}>
            <Head title={title} />
            <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-8 max-w-lg w-full text-center rounded-2xl">
                <h1 className="text-9xl font-black text-slate-900 mb-2 leading-none">
                    {status}
                </h1>
                <h2 className={`text-2xl font-black uppercase mb-6 bg-slate-900 text-white inline-block px-4 py-2 transform -rotate-1`}>
                    {title}
                </h2>
                <div className="bg-slate-100 p-4 border-2 border-slate-900 rounded-xl mb-8 font-mono text-sm shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    ⚠️ {description}
                </div>

                <Link
                    href="/"
                    className="inline-block bg-white text-slate-900 border-2 border-slate-900 px-8 py-3 rounded-full font-black text-lg transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none"
                >
                    BACK TO HOME 🏠
                </Link>
            </div>
        </div>
    );
}
