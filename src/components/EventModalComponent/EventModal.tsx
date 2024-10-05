import React, { useState, useEffect } from 'react';
import { Client } from "../../types/Client";
import Button from "../ButtonComponent/Button";

interface CalendarEvent {
    id: string;  // Add id here
    title: string;
    start: Date | string;
    end: Date | string;
    backgroundColor?: string;
    clientID?: string;
}

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, color: string, clientId: string) => void;
    onRemove: (id: string) => void;  // Add onRemove prop
    event?: CalendarEvent | null;
    client?: Client[] | null;
    mode: "edit" | "create";
}

const EventModal: React.FC<EventModalProps> = ({
                                                   isOpen,
                                                   onClose,
                                                   onSubmit,
                                                   onRemove,  // Destructure onRemove prop
                                                   event,
                                                   client,
                                                   mode
                                               }) => {
    const [title, setTitle] = useState('');
    const [appointmentColor, setAppointmentColor] = useState('#000000'); // Default color
    const [selectedClient, setSelectedClient] = useState('');
    const [clientId, setClientId] = useState('');
    const [isCanceled, setIsCanceled] = useState(false); // State for cancellation

    // Set title and color if the event exists
    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setAppointmentColor(event.backgroundColor || '#000000');
            const clientRecord = findRecordById(event.clientID);
            setSelectedClient(clientRecord ? clientRecord.id : '');
        }
    }, [event]);

    const findRecordById = (id: string | undefined) => {
        if (!id) return null;
        return client?.find(record => record.id === id);
    };

    const handleSubmit = () => {
        if (title) {
            onSubmit(title, appointmentColor, selectedClient); // Pass both title and color to parent
            onClose(); // Close the modal after submission
        }
    };

    const handleRemove = () => {
        if (event) {
            onRemove(event.id); // Call onRemove prop with the event ID
            onClose(); // Close the modal after removal
        }
    };

    const handleCancel = () => {
        setIsCanceled(true); // Set the canceled state to true
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 mx-4 md:mx-0">
                <h2 className="text-2xl font-semibold mb-4">{mode === "edit" ? "Edit Event" : "Create Event"}</h2>
                {event && (
                    <div className="mb-4 text-gray-500">
                        <p>Event Start: {new Date(event.start).toLocaleString()}</p>
                        <p>Event End: {new Date(event.end).toLocaleString()}</p>
                    </div>
                )}

                <div className="mb-4">
                    <input
                        type="text"
                        value={isCanceled ? title : title} // Display the title normally
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter event title"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        style={{ textDecoration: isCanceled ? 'line-through' : 'none' }} // Apply strikethrough if canceled
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Select Client</label>
                    <select
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)} // Update selected client on change
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">-- Select Client --</option>
                        {client?.map((list) => (
                            <option key={list.id} value={list.id}>
                                {list.firstName + " " + list.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center mb-4">
                    <input
                        type="color"
                        value={appointmentColor}
                        onChange={(e) => setAppointmentColor(e.target.value)}
                        className="w-12 h-12 rounded-lg focus:outline-none"
                    />
                    <input
                        type="text"
                        value={appointmentColor}
                        onChange={(e) => setAppointmentColor(e.target.value)}
                        className="ml-4 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="#000000"
                    />
                </div>

                <div className="flex flex-col justify-end ">
                    <div className={`flex flex-row `}>
                        <Button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 m-2p text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-indigo-500 m-2p text-white rounded-lg hover:bg-indigo-600"
                        >
                            {event ? 'Save' : 'Create'}
                        </Button>
                    </div>

                    {mode === "edit" && (
                        <div className={`text-center `}>
                            <Button
                                onClick={handleRemove} // Handle cancel action
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                variant={`transparent`}
                            >
                                Cancel Schedule
                            </Button>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
};

export default EventModal;
