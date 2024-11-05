import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Button from '../ButtonComponent/Button';
import { generateMicrotime } from "../../utilities/microTimeStamp";
import {Category} from "../../types/Category";


interface AddCategoryModalProps {
    onClose: () => void;
    onAddCategory: (category: Category) => void;
    categoryTagging: string;
    hasColorPicker?: boolean; // Make color picker optional
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
                                                               onClose,
                                                               onAddCategory,
                                                               categoryTagging,
                                                               hasColorPicker = true // Default value is true
                                                           }) => {
    const [categoryName, setCategoryName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [appointmentColor, setAppointmentColor] = useState<string>('#000000');

    const handleAddCategory = () => {
        if (categoryName.trim() && description.trim()) {
            const newCategory: Category = {
                id: generateMicrotime(), // Generate a unique id
                name: categoryName,
                description,
                created_at: new Date().toISOString(),
                ...(hasColorPicker && { appointmentColor }) // Add appointmentColor only if hasColorPicker is true
            };
            onAddCategory(newCategory);
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
                <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
                <input
                    type="text"
                    placeholder="Category Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="mb-2 border p-2 w-full"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-2 border p-2 w-full h-24 resize-none"
                />

                {hasColorPicker && ( // Render color picker only if hasColorPicker is true
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Appointment Color
                        </label>
                        <div className="flex items-center">
                            <input
                                type="color"
                                value={appointmentColor}
                                onChange={(e) => setAppointmentColor(e.target.value)}
                                className="w-12 h-12 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                value={appointmentColor}
                                onChange={(e) => setAppointmentColor(e.target.value)}
                                className="ml-4 p-2 border border-gray-300 rounded"
                                placeholder="#000000"
                            />
                        </div>
                    </div>
                )}

                <Button onClick={handleAddCategory} size="medium">
                    Add Category
                </Button>
            </div>
        </div>
    );
};

export default AddCategoryModal;
