import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import { useState } from 'react';

export default function Review({ auth, order }) {
    const { data: ratingData, setData: setRatingData, post: postRating, processing: ratingProcessing } = useForm({
        rating: 5,
        comment: ''
    });

    const { data: revisionData, setData: setRevisionData, post: postRevision, processing: revisionProcessing } = useForm({
        reason: ''
    });

    const [modalType, setModalType] = useState(null); // 'accept' | 'revision'

    const isImage = (path) => {
        if (!path) return false;
        const ext = path.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    };

    const handleAccept = (e) => {
        e.preventDefault();
        postRating(route('orders.accept', order.id), {
            onSuccess: () => setModalType(null)
        });
    };

    const handleRevision = (e) => {
        e.preventDefault();
        postRevision(route('orders.revision', order.id), {
            onSuccess: () => setModalType(null)
        });
    };

    // Star Rating Component
    const StarRating = ({ rating, setRating }) => (
        <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-4xl transition-transform hover:scale-110 focus:outline-none ${star <= rating ? 'text-yellow-400 drop-shadow-md' : 'text-gray-300'}`}
                >
                    ★
                </button>
            ))}
        </div>
    );

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Review Order #{order.order_number}</h2>}>
            <Head title={`Review #${order.order_number}`} />

            <div className="py-12 bg-[#F3F3F1] min-h-screen">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">

                    {/* Header / Status Banner */}
                    <div className="mb-8">
                        {order.status === 'review' && (
                            <div className="bg-purple-600 rounded-[2rem] p-8 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h1 className="text-3xl font-black mb-2">Review Hasil Pekerjaan</h1>
                                    <p className="text-purple-100 text-lg">Joki telah menyelesaikan pekerjaan. Mohon periksa hasil di bawah ini.</p>
                                </div>
                                <div className="px-6 py-2 bg-white/20 rounded-full font-bold backdrop-blur-sm border-2 border-white/30">
                                    Status: Waiting Your Review
                                </div>
                            </div>
                        )}
                        {order.status === 'revision' && (
                            <div className="bg-orange-500 rounded-[2rem] p-8 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-slate-900">
                                <h1 className="text-3xl font-black mb-2">Revisi Diminta</h1>
                                <p className="text-orange-100 text-lg">Anda telah meminta revisi. Menunggu Joki mengirimkan perbaikan.</p>
                            </div>
                        )}
                        {order.status === 'completed' && (
                            <div className="bg-green-600 rounded-[2rem] p-8 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-slate-900">
                                <h1 className="text-3xl font-black mb-2">Order Selesai!</h1>
                                <p className="text-green-100 text-lg">Terima kasih! Order ini telah selesai dan disetujui.</p>
                            </div>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* LEFT: PREVIEW AREA */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* File / Image Preview */}
                            <div className="bg-white rounded-[2rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                                <div className="p-6 border-b-2 border-slate-900 bg-slate-50 flex justify-between items-center">
                                    <h3 className="font-black text-xl text-slate-900">Preview Deliverable</h3>
                                    {order.result_file && (
                                        <a href={`/storage/${order.result_file}`} target="_blank" className="font-bold text-blue-600 hover:underline flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Download File
                                        </a>
                                    )}
                                </div>
                                <div className="p-8 flex items-center justify-center min-h-[400px] bg-slate-100">
                                    {order.result_file ? (
                                        isImage(order.result_file) ? (
                                            <img src={`/storage/${order.result_file}`} alt="Result Preview" className="max-w-full max-h-[600px] rounded-xl shadow-lg border-2 border-slate-200" />
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-slate-300">
                                                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                </div>
                                                <p className="text-xl font-bold text-slate-600 mb-2">File Format Not Previewable</p>
                                                <p className="text-slate-500 mb-6">Please download the file to view content.</p>
                                                <a href={`/storage/${order.result_file}`} target="_blank" className="inline-block px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-700 transition">Download .ZIP / File</a>
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-center text-slate-400">
                                            <p>No result file uploaded yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* External Link Preview (if applicable) */}
                            {order.external_link && (
                                <div className="bg-white rounded-[2rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-6">
                                    <h3 className="font-black text-xl text-slate-900 mb-4">External Link / Demo</h3>
                                    <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
                                        <div className="p-3 bg-blue-200 rounded-lg text-blue-700">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-bold text-slate-900 truncate">{order.external_link}</p>
                                            <p className="text-sm text-slate-500">Click to open link</p>
                                        </div>
                                        <a href={order.external_link} target="_blank" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Open</a>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* RIGHT: ACTION PANEL */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[2rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-8 sticky top-6">
                                <h3 className="font-black text-2xl text-slate-900 mb-6">Action Needed</h3>

                                {order.status === 'review' ? (
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setModalType('accept')}
                                            className="w-full py-4 bg-emerald-500 text-white font-black rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            Terima Hasil & Selesai
                                        </button>

                                        <button
                                            onClick={() => setModalType('revision')}
                                            className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            Ajukan Revisi
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                                        <p className="font-bold text-slate-400">No actions available currently.</p>
                                        <Link href={route('dashboard')} className="mt-4 inline-block text-blue-600 font-bold hover:underline">Back to Dashboard</Link>
                                    </div>
                                )}

                                <div className="mt-8 pt-8 border-t-2 border-slate-100">
                                    <h4 className="font-bold text-slate-900 mb-4">Version History</h4>
                                    <div className="space-y-3">
                                        {/* Main Result */}
                                        {order.result_file && (
                                            <div className="flex items-center gap-3 text-sm p-3 bg-slate-50 rounded-lg">
                                                <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-500">v1</div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-slate-900">Latest Result</p>
                                                    <p className="text-slate-500 text-xs">Uploaded just now</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* TODO: Iterate order.files if implementing history */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACCEPT MODAL */}
            <Modal show={modalType === 'accept'} onClose={() => setModalType(null)}>
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Puas dengan hasilnya?</h2>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Jika Anda menyetujui, order akan dianggap selesai dan dana akan diteruskan ke Joki.</p>

                    <form onSubmit={handleAccept} className="text-left bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 mb-6">
                        <div className="mb-6 flex justify-center">
                            <StarRating rating={ratingData.rating} setRating={(r) => setRatingData('rating', r)} />
                        </div>
                        <div className="mb-2">
                            <InputLabel value="Tulis Ulasan (Opsional)" className="font-bold uppercase tracking-wide text-xs mb-2" />
                            <TextInput
                                className="w-full"
                                value={ratingData.comment}
                                onChange={e => setRatingData('comment', e.target.value)}
                                placeholder="Contoh: Pekerjaan sangat cepat dan rapi!"
                            />
                        </div>
                    </form>

                    <div className="flex gap-4">
                        <SecondaryButton className="flex-1 justify-center py-3" onClick={() => setModalType(null)}>Batal</SecondaryButton>
                        <button
                            onClick={handleAccept}
                            disabled={ratingProcessing}
                            className="flex-1 py-3 bg-emerald-500 text-white font-black rounded-lg hover:bg-emerald-600 transition shadow-lg shadow-emerald-200"
                        >
                            Konfirmasi Selesai
                        </button>
                    </div>
                </div>
            </Modal>

            {/* REVISION MODAL */}
            <Modal show={modalType === 'revision'} onClose={() => setModalType(null)}>
                <div className="p-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl font-bold">!</span>
                        Ajukan Revisi
                    </h2>
                    <p className="text-slate-600 mb-6">Jelaskan bagian mana yang perlu diperbaiki oleh Joki.</p>

                    <form onSubmit={handleRevision}>
                        <div className="mb-6">
                            <InputLabel value="Catatan Revisi" className="font-bold text-slate-900 uppercase tracking-wide text-xs mb-2" />
                            <textarea
                                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 h-32"
                                value={revisionData.reason}
                                onChange={e => setRevisionData('reason', e.target.value)}
                                placeholder="Contoh: Tolong ganti warna header menjadi biru..."
                                required
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-3">
                            <SecondaryButton onClick={() => setModalType(null)}>Batal</SecondaryButton>
                            <button
                                type="submit"
                                disabled={revisionProcessing}
                                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-700 transition"
                            >
                                Kirim Revisi
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
