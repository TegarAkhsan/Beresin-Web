import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function DeleteConfirmationModal({ show, onClose, onConfirm, title, message, processing }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {message}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>
                        Cancel
                    </SecondaryButton>

                    <DangerButton onClick={onConfirm} disabled={processing}>
                        Delete
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
