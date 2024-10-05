import React, { useState } from 'react';
import Button from '../ButtonComponent/Button';
import {FaPlus} from "react-icons/fa";

interface UploadModalProps {
    onClose: () => void;
    onUpload: (file: File) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            onUpload(selectedFile);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-[-12px] mr-[-12px] w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white z-50"
                >
                    <FaPlus className="transform rotate-45"/>
                </button>
                <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="mb-4 border p-2 w-full"
                />
                <Button onClick={handleUpload} size="medium">
                    Upload
                </Button>
            </div>
        </div>
    );
};

export default UploadModal;

