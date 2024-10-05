import React from 'react';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    isSuccess: boolean; // true for success, false for failure
}

const NotificationModal: React.FC<NotificationModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 message,
                                                                 isSuccess,
                                                             }) => {
    if (!isOpen) return null;

    const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';

    return (
        <div className="fixed inset-0 flex items-start justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className={`bg-white rounded-lg shadow-lg p-6 mt-20 ${borderColor} border-t-8 z-10`}>
                <h2 className="text-lg font-bold mb-4">{isSuccess ? 'Success!' : 'Error!'}</h2>
                <p className="text-gray-700">{message}</p>
                <button
                    className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default NotificationModal;
