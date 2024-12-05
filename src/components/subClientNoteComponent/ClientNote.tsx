import React, {useState} from "react";
import { useSelector } from 'react-redux';
import {RootState} from "../../redux/store";
import {Notes} from "../../types/Notes";
import {useAppDispatch} from "../../hook";
import InputText from "../InputTextComponent/InputText";
import Button from "../ButtonComponent/Button";
import {FaPlus,FaCross} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import TextView from "../TextViewComponent/TextView";
import FreeTextViewer from "../PdfViewerComponent/FreeTextViewer";
import FreetextModal from "../FreetextModalComponent/UploadModal";
import {generateMicrotime} from "../../utilities/microTimeStamp";
import {addOrUpdateNote} from "../../redux/slices/notesSlice";
interface ClientNote {
    id: string;
    name: string;
    created_at: string;
    note: string;
}
interface ClientNotesProps {
     clientsNotes: ClientNote[];
     clientId: string;
}

const ClientNote:  React.FC<ClientNotesProps> = ({ clientsNotes,clientId })=> {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<Notes>({
        id: generateMicrotime().toString(),
        userId: clientId,
        note: '',
        created_at:new Date().toISOString()
    })
    const notes = useSelector((state: RootState) => state.notes.valueNotes);

    const [currentPage, setCurrentPage] = useState(0);
    const clientsPerPage = 10;
    const displayedClientDocs = clientsNotes.slice(currentPage * clientsPerPage, (currentPage + 1) * clientsPerPage);
    const [selectedNote, setSelectedNote] = useState<string | null>(null);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const handleClick = () => {
        setIsNotesModalOpen(true);
    };
    const handleItemClick = (note: string) => {
        setSelectedNote(note);
    };

    const handleClosePDF = () => {
        setSelectedNote(null);
    };
    console.log(notes)
    const handleSave = async (text: string) => {
        const updatedFormData = { ...formData, note: text }; // Create updated data
        setFormData(updatedFormData); // Update state
        dispatch(addOrUpdateNote(updatedFormData)); // Dispatch with the updated data
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
            {isNotesModalOpen && <FreetextModal onSave={handleSave} onClose={() => setIsNotesModalOpen(false)}/> }

        </div>
    );
}
export default ClientNote;
