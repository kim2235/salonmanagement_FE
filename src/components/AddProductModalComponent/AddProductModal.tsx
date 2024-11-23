import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOrUpdateProduct } from '../../redux/slices/productSlice';
import { FaPlus } from 'react-icons/fa';
import Button from '../ButtonComponent/Button';
import { generateMicrotime } from '../../utilities/microTimeStamp';
import { Category} from "../../types/Category";
import {Product} from "../../types/Product";
import InputText from '../InputTextComponent/InputText';
import TextArea from '../TextAreaComponent/TextArea';
import Select from "../SelectComponent/Select";

interface AddProductModalProps {
    onClose: () => void;
    categories: Category[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, categories }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        productName: '',
        shortDescription: '',
        category: '',
        description: '',
        thumbnail: '',
        supplier: '',
        stockQuantity: 1,
        stockQuantityUsed: 0,
        stockQuantityRemaining:1,
        trackStock: false,
        lowStockQuantity: 1,
        reorderQuantity: 1,
        measurementUnit: 'ml',
        measurementAmount: 1,
        isoverthecounter: false,
        price: 0
    });
    const unitOptions = [
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newValue: string | number | boolean = value;

        if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
            newValue = e.target.checked;
        } console.log("Input changed:", name, newValue);

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    const handleAddProduct = () => {
        if (formData.productName && formData.shortDescription && formData.category && formData.description && formData.thumbnail) {
            const newProduct: Product = {
                id: generateMicrotime(),
                name: formData.productName,
                shortDescription: formData.shortDescription,
                category: formData.category,
                description: formData.description,
                created_at: new Date().toISOString(),
                thumbnail: formData.thumbnail,
                supplier: formData.supplier,
                stockQuantity: formData.stockQuantity,
                stockQuantityUsed: 0,
                stockQuantityRemaining: formData.stockQuantity,
                trackStock: formData.trackStock,
                lowStockQuantity: formData.lowStockQuantity,
                reorderQuantity: formData.reorderQuantity,
                measurementUnit: formData.measurementUnit,
                measurementAmount: formData.measurementAmount,
                isoverthecounter: formData.isoverthecounter,
                price: formData.price,
            };
            dispatch(addOrUpdateProduct(newProduct));
            onClose();
        }
    };

    // Handle file upload and convert to base64 for preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevData) => ({ ...prevData, thumbnail: reader.result as string }));
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
                                name="productName"
                                placeholder="Product Name"
                                value={formData.productName} onChange={handleInputChange}
                            />
                        </div>
                        <div className={`mb-2`}>
                            <InputText
                                name="shortDescription"
                                placeholder="Product Short Description"
                                value={formData.shortDescription} onChange={handleInputChange}
                            />
                        </div>

                        <div className={`mb-2`}>
                            <Select name="category" label="Product Category" value={formData.category} onChange={handleInputChange}>
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
                                <Select name="measurementUnit" label="Measure" value={formData.measurementUnit} onChange={handleInputChange}>
                                    <option disabled value="">Select Unit</option>
                                    {unitOptions.map((unit) => (
                                        <option key={unit.value} value={unit.value}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className={`w-1/2 mb-2 ml-2`}>
                                <label className={`block text-sm font-medium mb-2`}>Amount</label>
                                <InputText
                                    name="measurementAmount"
                                    type="text"
                                    placeholder="Measurement Amount"
                                    value={formData.measurementAmount} onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <TextArea
                            name="description"
                            placeholder="Product Description"
                            value={formData.description} onChange={handleInputChange}
                        />

                        {/* Divider and Stock Management Section */}
                        <hr className={`my-4`}/>
                        <h3 className={`text-lg font-semibold mb-2`}>Stock Management</h3>
                        <div className={`mb-2`}>
                            <InputText
                                name="supplier"
                                placeholder="Supplier"
                                value={formData.supplier} onChange={handleInputChange}
                            />
                        </div>
                        <div className={`mb-2`}>
                            <label className={`block text-sm font-medium mb-1`}>Current Stock Quantity</label>
                            <InputText
                                name={`stockQuantity`}
                                type="number"
                                placeholder="Current Stock Quantity"
                                value={formData.stockQuantity} onChange={handleInputChange}
                            />
                        </div>

                        <div className={`flex items-center mb-4`}>
                            <input
                                name={`trackStock`}
                                type="checkbox"
                                checked={formData.trackStock} onChange={handleInputChange}
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
                                        name={`lowStockQuantity`}
                                        type="number"
                                        placeholder="Low Stock Quantity"
                                        value={formData.lowStockQuantity} onChange={handleInputChange}
                                    />
                                </div>
                                <div className={`w-1/2 mb-2 ml-2`}>
                                    <label className={`block text-sm font-medium mb-1`}>Reorder Quantity</label>
                                    <InputText
                                        name={`reorderQuantity`}
                                        type="number"
                                        placeholder="Reorder Quantity"
                                        value={formData.reorderQuantity} onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={`w-1/3 flex flex-col items-center`}>
                        <div>
                            <label className={`block text-sm font-medium mb-2`}>Upload Thumbnail</label>
                            <input name={`thumbnail`} type="file" accept="image/*" onChange={handleFileChange}
                                   className="mb-2 border p-2 w-full"/>
                            {formData.thumbnail && (
                                <div className="mt-2">
                                    <img src={formData.thumbnail} alt="Thumbnail Preview"
                                         className="w-full h-48 object-cover rounded border"/>
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                name={`isoverthecounter`}
                                type="checkbox"
                                checked={formData.isoverthecounter} onChange={handleInputChange}
                                className={`mr-2`}
                            />
                            <label>For Over the Counter?</label>
                        </div>
                        {formData.isoverthecounter && ( // Conditional rendering for the price input
                            <div>
                                <label className="block text-sm font-medium mb-2">Price</label>
                                <InputText
                                    name="price"
                                    type="number"
                                    placeholder="Enter Price"
                                    value={formData.price}
                                    onChange={handleInputChange}
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
