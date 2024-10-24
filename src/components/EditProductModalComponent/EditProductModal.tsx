import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import Button from '../ButtonComponent/Button';
import InputText from '../InputTextComponent/InputText';
import TextArea from '../TextAreaComponent/TextArea';
import Select from "../SelectComponent/Select";
import {Category} from "../AddCategoryModalComponent/AddCategoryModal";
import {Product} from "../AddProductModalComponent/AddProductModal";


interface EditProductModalProps {
    product: Product; // Existing product to edit
    onClose: () => void;
    onSaveProduct: (updatedProduct: Product) => void;
    categories: Category[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose, onSaveProduct, categories }) => {
    const [productName, setProductName] = useState<string>(product.name);
    const [shortDescription, setShortDescription] = useState<string>(product.shortDescription);
    const [category, setCategory] = useState<string>(product.category);
    const [description, setDescription] = useState<string>(product.description);
    const [thumbnail, setThumbnail] = useState<string>(product.thumbnail);
    const [supplier, setSupplier] = useState<string>(product.supplier);
    const [stockQuantity, setStockQuantity] = useState<number>(product.stockQuantity);
    const [trackStock, setTrackStock] = useState<boolean>(product.trackStock);
    const [lowStockQuantity, setLowStockQuantity] = useState<number>(product.lowStockQuantity);
    const [reorderQuantity, setReorderQuantity] = useState<number>(product.reorderQuantity);
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
    useEffect(() => {
        setProductName(product.name);
        setShortDescription(product.shortDescription);
        setCategory(product.category);
        setDescription(product.description);
        setThumbnail(product.thumbnail);
        setSupplier(product.supplier);
        setStockQuantity(product.stockQuantity);
        setTrackStock(product.trackStock);
        setLowStockQuantity(product.lowStockQuantity);
        setReorderQuantity(product.reorderQuantity);
        setMeasurementUnit(product.measurementUnit);
        setMeasurementAmount(product.measurementAmount);
    }, [product]);

    const handleSaveProduct = () => {
        const updatedProduct: Product = {
            ...product,
            name: productName,
            shortDescription,
            category,
            description,
            thumbnail,
            supplier,
            stockQuantity,
            trackStock,
            lowStockQuantity,
            reorderQuantity,
            measurementUnit,
            measurementAmount,
        };
        onSaveProduct(updatedProduct);
        onClose();
    };

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
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] relative flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-[-12px] mr-[-12px] w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white z-50"
                    aria-label="Close Modal"
                >
                    <FaPlus className="transform rotate-45" />
                </button>
                <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
                <div className="flex flex-grow">
                    <div className="flex-1 pr-4">
                        <div className="mb-2">
                            <InputText
                                placeholder="Product Name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </div>
                        <div className="mb-2">
                            <InputText
                                placeholder="Product Short Description"
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                            />
                        </div>
                        <div className="mb-2">
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
                        <hr className="my-4"/>
                        <h3 className="text-lg font-semibold mb-2">Stock Management</h3>
                        <div className="mb-2">
                            <InputText
                                placeholder="Supplier"
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                            />
                        </div>
                        <div className="mb-2">
                            <InputText
                                type="number"
                                placeholder="Current Stock Quantity"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                checked={trackStock}
                                onChange={() => setTrackStock(!trackStock)}
                                className="mr-2"
                            />
                            <label>Track Stock?</label>
                        </div>
                        <div className="mb-2">
                            <h2 className="text-lg font-medium mb-1">Low Stock Reordering</h2>
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">Low Stock Level</label>
                                <InputText
                                    type="number"
                                    placeholder="Low Stock Quantity"
                                    value={lowStockQuantity}
                                    onChange={(e) => setLowStockQuantity(Number(e.target.value))}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">Reorder Quantity</label>
                                <InputText
                                    type="number"
                                    placeholder="Reorder Quantity"
                                    value={reorderQuantity}
                                    onChange={(e) => setReorderQuantity(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-1/3 flex flex-col items-center">
                        <label className="block text-sm font-medium mb-2">Upload Thumbnail</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mb-2 border p-2 w-full"
                        />
                        {thumbnail && (
                            <div className="mt-2">
                                <img
                                    src={thumbnail}
                                    alt="Thumbnail Preview"
                                    className="w-full h-48 object-cover rounded border"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <Button onClick={handleSaveProduct} size="medium" className="mt-4">
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default EditProductModal;
