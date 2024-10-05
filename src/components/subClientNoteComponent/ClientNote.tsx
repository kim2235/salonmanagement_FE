import React, {useState} from "react";
import InputText from "../InputTextComponent/InputText";
import Button from "../ButtonComponent/Button";
import {FaPlus,FaCross} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import TextView from "../TextViewComponent/TextView";
import FreeTextViewer from "../PdfViewerComponent/FreeTextViewer";
import UploadModal from "../UploadModalComponent/UploadModal";
import FreetextModal from "../FreetextModalComponent/UploadModal";
interface ClientNote {
    id: string;
    name: string;
    created_at: string;
    note: string;
}
interface ClientNotesProps {
     clientsNotes: ClientNote[];
}

const ClientNote:  React.FC<ClientNotesProps> = ({ clientsNotes })=> {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const clientsPerPage = 10;
    const displayedClientDocs = clientsNotes.slice(currentPage * clientsPerPage, (currentPage + 1) * clientsPerPage);
    const [selectedNote, setSelectedNote] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const handleClick = () => {
        setIsUploadModalOpen(true);
    };
    const handleUpload = (file: File) => {
        // Handle file upload logic here
        console.log("Uploaded file:", file);
        setIsUploadModalOpen(false);
    };
    const handleItemClick = (note: string) => {
        setSelectedNote(note);
    };

    const handleClosePDF = () => {
        setSelectedNote(null);
    };

    const handleSave = (text: string) => {
        console.log('Saved text:', text);
        // Perform any further actions like saving the text to a server or updating state
    };
    return( <div id={`clientDocument`}>
        <div className="flex flex-wrap w-full">
            <div className="m-2 flex w-full">
                <div className="w-1/2">
                    <InputText placeholder="Search Document" name="clientDocumentSearch"/>
                </div>
                <div className="w-1/6 ml-4">  {/* Added margin-left class */}
                    <Button onClick={handleClick}><FaPlus className="mr-2"/>Create Note</Button>
                </div>
            </div>
            <div className="m-2 flex flex-col w-full">
                {/* Header Row */}
                <div className="mt-2 flex items-center justify-start border-b border-b-gray-300 w-full">
                    <div className="p-2 w-1/6">
                        <TextView text="ID"/>
                    </div>
                    <div className="p-2 w-1/3 text-center">
                        <TextView text="Note"/>
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
                            <div onClick={() => handleItemClick(clientDoc.note)} className="p-2 w-1/3 text-center">
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
            {selectedNote && <FreeTextViewer note={selectedNote} onClose={handleClosePDF} />}
            {/* Upload Modal */}
            {isUploadModalOpen && <FreetextModal onSave={handleSave} onClose={() => setIsUploadModalOpen(false)}/> }

        </div>
    );
}
export default ClientNote;
