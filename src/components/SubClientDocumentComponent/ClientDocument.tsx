import React, {useState} from "react";
import InputText from "../InputTextComponent/InputText";
import Button from "../ButtonComponent/Button";
import {FaPlus} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import TextView from "../TextViewComponent/TextView";
import FreeTextViewer from "../PdfViewerComponent/FreeTextViewer";
import UploadModal from "../UploadModalComponent/UploadModal";
interface ClientDoc {
    id: string;
    name: string;
    created_at: string;
    pdfUrl: string;
}
interface ClientDocumentProps {
     clientsDocs: ClientDoc[];
}

const ClientDocument:  React.FC<ClientDocumentProps> = ({ clientsDocs })=> {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const clientsPerPage = 10;
    const displayedClientDocs = clientsDocs.slice(currentPage * clientsPerPage, (currentPage + 1) * clientsPerPage);
    const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const handleClick = () => {
        setIsUploadModalOpen(true);
    };
    const handleUpload = (file: File) => {
        // Handle file upload logic here
        console.log("Uploaded file:", file);
        setIsUploadModalOpen(false);
    };
    const handleItemClick = (pdfUrl: string) => {
        setSelectedPDF(pdfUrl);
    };

    const handleClosePDF = () => {
        setSelectedPDF(null);
    };
    return( <div id={`clientDocument`}>
        <div className="flex flex-wrap w-full">
            <div className="m-2 flex w-full">
                <div className="w-1/2">
                    <InputText placeholder="Search Document" name="clientDocumentSearch"/>
                </div>
                <div className="w-1/6 ml-4">  {/* Added margin-left class */}
                    <Button onClick={handleClick}><FaPlus className="mr-2"/>Add Document</Button>
                </div>
            </div>
            <div className="m-2 flex flex-col w-full">
                {/* Header Row */}
                <div className="mt-2 flex items-center justify-start border-b border-b-gray-300 w-full">
                    <div className="p-2 w-1/6">
                        <TextView text="ID"/>
                    </div>
                    <div className="p-2 w-1/3 text-center">
                        <TextView text="Document Name"/>
                    </div>
                    <div className="p-2 w-1/4 text-center">
                        <TextView text="Created At"/>
                    </div>
                    <div className="p-2 w-1/6 text-center">
                        <TextView text="Action"/>
                    </div>
                </div>

                {/* Mapped Items */}
                <div className="w-full">
                    {displayedClientDocs.map((clientDoc, index) => (
                        <div
                            key={index}
                            className="mt-2 flex items-center justify-start border-b pb-2 border-b-gray-300 cursor-pointer"
                        >
                            <div className="p-2 w-1/6 flex-shrink-0 text-center">
                                <TextView text={clientDoc.id}/>
                            </div>
                            <div onClick={() => handleItemClick(clientDoc.pdfUrl)} className="p-2 w-1/3 text-center">
                                <TextView text={clientDoc.name}/>
                            </div>
                            <div className="p-2 w-1/4 text-center">
                                <TextView text={clientDoc.created_at}/>
                            </div>
                            <div className="p-2 w-1/6 text-center">
                                <TextView text="-"/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
            {/* PDF Viewer Modal */}
            {selectedPDF && <FreeTextViewer note={selectedPDF} onClose={handleClosePDF} />}
            {/* Upload Modal */}
            {isUploadModalOpen && <UploadModal onClose={() => setIsUploadModalOpen(false)} onUpload={handleUpload} />}

        </div>
    );
}
export default ClientDocument;
