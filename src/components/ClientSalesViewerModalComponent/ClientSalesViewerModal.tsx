import React, { useState } from 'react';
import { Sales } from '../../types/Sales'; // Adjust the import path
import salesItems from '../../testData/salesItems.json';
import Button from "../ButtonComponent/Button";
interface SalesDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    salesDetails: Sales; // Use your existing interface here
    onSave: (updatedSales: Sales) => void; // Add a prop for saving
}

const ClientSalesViewerModal: React.FC<SalesDetailsModalProps> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      salesDetails,
                                                                      onSave, // Destructure the onSave prop
                                                                  }) => {
    const [inputValue, setInputValue] = useState<string>('');

    if (!isOpen) return null;

    const handleSave = () => {
        // Create a copy of the salesDetails and update the necessary fields
        const updatedSales: Sales = {
            ...salesDetails,
            status: Number(inputValue) >= Number(salesDetails.balance) ? 'paid' : 'unpaid',
            payment: Number(inputValue) || 0, // Update the payment with the input value
        };

        onSave(updatedSales);
        // Optionally, close the modal after saving
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-start justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="bg-white rounded-lg shadow-lg p-6 mt-20 z-10">
                <h2 className="text-lg font-bold mb-4">Sale Details</h2>
                <div className="mb-4">
                    <h3 className="font-semibold">Sale ID: {salesDetails.id}</h3>
                    <h3 className="font-semibold">Client: {salesDetails.client.clientName}</h3>
                    <h3 className="font-semibold">Date: {salesDetails.date}</h3>
                </div>
                <h3 className="font-semibold mb-2">Services:</h3>
                <div className={`overflow-y-auto max-h-60`}>
                    <ul className="list-disc list-inside mb-4">
                        Service/Packages that this client avail:
                        {salesItems.map((service) => (
                            <li key={service.id}>
                                <span className="font-medium">{service.name}</span> -
                                ${service.cost.toFixed(2)}: {service.description}
                            </li>
                        ))}
                    </ul>

                </div>
                    <h3 className="font-semibold">Total: ${salesDetails.total.toFixed(2)}</h3>

                    {salesDetails.status === 'paid' && (
                        <div className="mt-4">
                            <label className="block mb-2 font-semibold" htmlFor="inputField">
                                Paid Amount:
                            </label>
                            <input
                                type="text"
                                id="inputField"
                                value={salesDetails.payment}
                                className="pointer-events-none border bg-gray-200 border-gray-300 rounded-lg py-2 px-4 w-full disabled"
                                placeholder="Enter amount"
                            />
                        </div>
                    )}

                    {/* Conditional rendering of the input box */}
                    {salesDetails.status === 'unpaid' && (
                        <div className="mt-4">
                            <label className="block mb-2 font-semibold" htmlFor="inputField">
                                Enter Payment Amount:
                            </label>
                            <input
                                type="number"
                                id="inputField"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                                placeholder="Enter amount"
                            />
                        </div>
                    )}


                {/* Save button */}
                {salesDetails.status === 'unpaid' && (
                    <Button
                        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                )}

                <Button
                    className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
                    onClick={onClose}
                >
                    Close
                </Button>
            </div>
        </div>
    );
};

export default ClientSalesViewerModal;
