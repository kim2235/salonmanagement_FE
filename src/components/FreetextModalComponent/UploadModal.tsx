import React, { useState } from 'react';
import Button from '../ButtonComponent/Button';
import {FaPlus} from "react-icons/fa";

interface TextAreaWithSaveButtonProps {
    onSave: (text: string) => void;
    onClose: () => void;
    placeholder?: string;
    initialText?: string;
}

const FreetextModal: React.FC<TextAreaWithSaveButtonProps> = ({ onClose, onSave, placeholder = "Enter text here...", initialText = "" }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [text, setText] = useState<string>(initialText);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleSaveClick = () => {
        onSave(text);
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
                <h2 className="text-xl font-semibold mb-4">Note Management</h2>
                <div className="p-4 border rounded shadow-lg bg-white">
            <textarea
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={text}
                onChange={handleTextChange}
                placeholder={placeholder}
            />
                    <div className="mt-2 flex justify-end">
                        <Button onClick={handleSaveClick}>Save</Button>
                       
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreetextModal;

