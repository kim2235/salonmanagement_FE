import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { FaPlus } from "react-icons/fa";

interface PDFViewerProps {
    fileUrl: string;
    onClose: () => void;
}

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, onClose }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const goToPrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const goToNextPage = () => {
        if (numPages && pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

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
                    {/* Page Navigation */}
                    {numPages && (
                        <div className="relative flex justify-center items-center mt-4 space-x-4 z-50">
                            <button
                                onClick={goToPrevPage}
                                disabled={pageNumber <= 1}
                                className="px-4 py-2 border border-gray-300 rounded"
                            >
                                Previous
                            </button>
                            <span>{`Page ${pageNumber} of ${numPages}`}</span>
                            <button
                                onClick={goToNextPage}
                                disabled={pageNumber >= numPages}
                                className="px-4 py-2 border border-gray-300 rounded"
                            >
                                Next
                            </button>
                        </div>
                    )}

                    <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page pageNumber={pageNumber} />
                    </Document>

                    {/* Page Navigation */}
                    {numPages && (
                        <div className="relative flex justify-center items-center mt-4 space-x-4 z-50">
                            <button
                                onClick={goToPrevPage}
                                disabled={pageNumber <= 1}
                                className="px-4 py-2 border border-gray-300 rounded"
                            >
                                Previous
                            </button>
                            <span>{`Page ${pageNumber} of ${numPages}`}</span>
                            <button
                                onClick={goToNextPage}
                                disabled={pageNumber >= numPages}
                                className="px-4 py-2 border border-gray-300 rounded"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
};

export default PDFViewer;
