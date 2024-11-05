import React, { useState } from 'react';
import {FaEdit, FaPlus} from 'react-icons/fa';
import Button from '../ButtonComponent/Button';
import {Category} from "../../types/Category";

interface ProductCategoryListingModalProps {
    categories: Category[];  // List of categories to display
    onClose: () => void;
    onUpdateCategory: (updatedCategory: Category) => void;
}

const ProductCategoryListingModal: React.FC<ProductCategoryListingModalProps> = ({
                                                                                     categories,
                                                                                     onClose,
                                                                                     onUpdateCategory,
                                                                                 }) => {
    const [editableCategory, setEditableCategory] = useState<{ [key: string]: boolean }>({}); // To track which category is being edited
    const [updatedCategories, setUpdatedCategories] = useState<Category[]>(categories); // Track updated categories locally

    // Handle changes to category name/description for editing
    const handleCategoryChange = (id: string | number, field: keyof Category, value: string) => {
        setUpdatedCategories((prevCategories) =>
            prevCategories.map((cat) =>
                cat.id === id ? { ...cat, [field]: value } : cat
            )
        );
    };

    // Toggle editable state for a specific category
    const toggleEditable = (id: string | number) => {
        setEditableCategory((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Handle save action for category updates
    const handleSaveCategory = (category: Category) => {
        onUpdateCategory(category);
        toggleEditable(category.id); // Turn off editing after saving
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-w-4xl max-h-[500px] relative"> {/* Change width here */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-[-12px] mr-[-12px] w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white z-50"
                >
                    <FaPlus className="transform rotate-45"/>
                </button>
                <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
                <div className={`max-h-[400px] overflow-y-auto relative`}>
                    {categories.length === 0 ? (
                        <div className="text-gray-500">No categories available</div>
                    ) : (
                        <ul>
                            {updatedCategories.map((category) => (
                                <li key={category.id} className="mb-4 flex items-center">
                                    {editableCategory[category.id] ? (
                                        <>
                                            <input
                                                type="text"
                                                value={category.name}
                                                onChange={(e) =>
                                                    handleCategoryChange(category.id, 'name', e.target.value)
                                                }
                                                className="border p-2 mr-2 w-full h-10"
                                                placeholder="Category Name"
                                            />
                                            <textarea
                                                value={category.description}
                                                onChange={(e) =>
                                                    handleCategoryChange(category.id, 'description', e.target.value)
                                                }
                                                className="border p-2 mr-2 w-full h-10 resize-none overflow-hidden"
                                                placeholder="Category Description"
                                            />
                                            <Button onClick={() => handleSaveCategory(category)} size="small">
                                                Save
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="mr-2">{category.name}</span>
                                            <span className="mr-2 text-gray-500">{category.description}</span>
                                            <FaEdit
                                                onClick={() => toggleEditable(category.id)}
                                                className="cursor-pointer text-blue-500 hover:text-blue-700"
                                                size={16} // You can adjust the size as needed
                                            />
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProductCategoryListingModal;
