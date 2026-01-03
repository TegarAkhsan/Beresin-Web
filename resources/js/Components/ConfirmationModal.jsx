import { Fragment, useRef } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function ConfirmationModal({
    show = false,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onClose,
    isDanger = false
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className={`text-lg font-medium ${isDanger ? 'text-red-900 dark:text-red-100' : 'text-gray-900 dark:text-gray-100'}`}>
                    {title}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {message}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>
                        {cancelText}
                    </SecondaryButton>

                    {isDanger ? (
                        <DangerButton onClick={onConfirm}>
                            {confirmText}
                        </DangerButton>
                    ) : (
                        <PrimaryButton onClick={onConfirm} className="bg-teal-600 hover:bg-teal-700 focus:bg-teal-700 active:bg-teal-900">
                            {confirmText}
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </Modal>
    );
}
