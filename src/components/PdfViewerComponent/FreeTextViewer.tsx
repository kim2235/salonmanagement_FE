import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa";

interface PDFViewerProps {
    note: string;
    onClose: () => void;
}

const FreeTextViewer: React.FC<PDFViewerProps> = ({ note, onClose }) => {


    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="relative max-w-3xl w-full h-3/4 bg-white p-4 border border-gray-300 rounded-lg">
                {/* X Button */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-[-12px] mr-[-12px] w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white z-50"
                >
                    <FaPlus className="transform rotate-45"/>
                </button>

                {/* PDF Document */}
                <div className="relative w-full h-full bg-white overflow-auto z-40">
                    <div>{note}</div>
                </div>


            </div>
        </div>
    );
};

export default FreeTextViewer;
