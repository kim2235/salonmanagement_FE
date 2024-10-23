import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Button from '../ButtonComponent/Button';
import { generateMicrotime } from '../../utilities/microTimeStamp';
import { Category } from "../AddCategoryModalComponent/AddCategoryModal"; // Assuming this is the correct import
import InputText from '../InputTextComponent/InputText'; // Import your reusable InputText component
import TextArea from '../TextAreaComponent/TextArea';
import Select from "../SelectComponent/Select"; // Import your reusable Select component

export interface Product {
    id: string | number;
    name: string;
    shortDescription: string;
    category: string;
    description: string;
    created_at: string;
    thumbnail: string; // URL or base64 string of the thumbnail
    supplier: string; // New field
    stockQuantity: number; // New field
    trackStock: boolean; // New field
    lowStockQuantity: number; // New field
    reorderQuantity: number; // New field
    measurementUnit: string; // New field
    measurementAmount: number; // New field
}

interface AddProductModalProps {
    onClose: () => void;
    onAddProduct: (product: Product) => void;
    categories: Category[]; // Array of categories for dropdown
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onAddProduct, categories }) => {
    const [productName, setProductName] = useState<string>('');
    const [shortDescription, setShortDescription] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [thumbnail, setThumbnail] = useState<string>(''); // Base64 string or URL for the image preview
    const [supplier, setSupplier] = useState<string>(''); // New state
    const [stockQuantity, setStockQuantity] = useState<number>(1); // New state
    const [trackStock, setTrackStock] = useState<boolean>(false); // New state
    const [lowStockQuantity, setLowStockQuantity] = useState<number>(1); // New state
    const [reorderQuantity, setReorderQuantity] = useState<number>(1); // New state
    const [measurementUnit, setMeasurementUnit] = useState<string>('ml'); // New state
    const [measurementAmount, setMeasurementAmount] = useState<number>(1); // New state
    const unit = [
        {
            name: 'Milliliters (ml)',
            value: 'ml'
        },
        {
            name: 'Gallons (gal)',
            value: 'gal'
        },
        {
            name: 'Liters (l)',
            value: 'l'
        }
    ]
    const handleAddProduct = () => {
        if (productName.trim() && shortDescription.trim() && category && description.trim() && thumbnail) {
            const newProduct: Product = {
                id: generateMicrotime(),
                name: productName,
                shortDescription,
                category,
                description,
                created_at: new Date().toISOString(),
                thumbnail,
                supplier,
                stockQuantity,
                trackStock,
                lowStockQuantity,
                reorderQuantity,
                measurementUnit,
                measurementAmount
            };
            onAddProduct(newProduct);
            onClose();
        }
    };

    // Handle file upload and convert to base64 for preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50`}>
            <div className={`bg-white p-6 rounded-lg shadow-lg w-[600px] relative flex flex-col`}>
                <button
                    onClick={onClose}
                    className={`absolute top-0 right-0 mt-[-12px] mr-[-12px] w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white z-50`}
                    aria-label="Close Modal"
                >
                    <FaPlus className={`transform rotate-45`} />
                </button>
                <h2 className={`text-xl font-semibold mb-4`}>Add New Product</h2>
                <div className={`flex flex-grow`}>
                    <div className={`flex-1 pr-4`}>
                        <div className={`mb-2`}>
                            <InputText
                                placeholder="Product Name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </div>
                        <div className={`mb-2`}>
                            <InputText
                                placeholder="Product Short Description"
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                            />
                        </div>

                        <div className={`mb-2`}>
                            <Select
                                label="Product Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div className={`flex`}>
                            <div className={`w-1/2 mb-2 mr-2`}>
                                <Select
                                    label="Measure"
                                    value={measurementUnit}
                                    onChange={(e) => setMeasurementUnit(e.target.value)}
                                >
                                    <option disabled={true} value="">Select Unit</option>
                                    {unit.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className={`w-1/2 mb-2 ml-2`}>
                                <label className={`block text-sm font-medium mb-2`}>Amount</label>
                                <InputText
                                    type="text"
                                    placeholder="Measurement Amount"
                                    value={measurementAmount}
                                    onChange={(e) => setMeasurementAmount(Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <TextArea
                            placeholder="Product Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        {/* Divider and Stock Management Section */}
                        <hr className={`my-4`}/>
                        <h3 className={`text-lg font-semibold mb-2`}>Stock Management</h3>
                        <div className={`mb-2`}>
                            <InputText
                                placeholder="Supplier"
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                            />
                        </div>
                        <div className={`mb-2`}>
                            <label className={`block text-sm font-medium mb-1`}>Current Stock Quantity</label>
                            <InputText
                                type="number"
                                placeholder="Current Stock Quantity"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(Number(e.target.value))}
                            />
                        </div>

                        <div className={`flex items-center mb-4`}>
                            <input
                                type="checkbox"
                                checked={trackStock}
                                onChange={() => setTrackStock(!trackStock)}
                                className={`mr-2`}
                            />
                            <label>Track Stock?</label>
                        </div>
                        <div className={`flex flex-col mb-2`}>
                            <div className={'w-full'}>
                                <h2 className={`text-lg font-medium mb-1`}>Low Stock Reordering</h2>
                            </div>

                            <div className={`flex`}>
                                <div className={`w-1/2 mb-2 mr-2`}>
                                    <label className={`block text-sm font-medium mb-1`}>Low Stock Level</label>
                                    <InputText
                                        type="number"
                                        placeholder="Low Stock Quantity"
                                        value={lowStockQuantity}
                                        onChange={(e) => setLowStockQuantity(Number(e.target.value))}
                                    />
                                </div>
                                <div className={`w-1/2 mb-2 ml-2`}>
                                    <label className={`block text-sm font-medium mb-1`}>Reorder Quantity</label>
                                    <InputText
                                        type="number"
                                        placeholder="Reorder Quantity"
                                        value={reorderQuantity}
                                        onChange={(e) => setReorderQuantity(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={`w-1/3 flex flex-col items-center`}>
                        <label className={`block text-sm font-medium mb-2`}>Upload Thumbnail</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={`mb-2 border p-2 w-full`}
                        />
                        {thumbnail && (
                            <div className={`mt-2`}>
                                <img
                                    src={thumbnail}
                                    alt="Thumbnail Preview"
                                    className={`w-full h-48 object-cover rounded border`}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <Button onClick={handleAddProduct} size="medium" className={`mt-4`}>
                    Add Product
                </Button>
            </div>
        </div>
    );
};

export default AddProductModal;
