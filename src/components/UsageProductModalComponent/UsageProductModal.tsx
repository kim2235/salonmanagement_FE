import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import { RootState } from "../../redux/store";
import TextView from "../TextViewComponent/TextView";
import InputText from "../InputTextComponent/InputText";

import { getServicesByProductId } from "../../redux/slices/serviceSlice";
import { selectSalesItemsByProductId } from "../../redux/slices/salesItemsSlice";

interface AddProductModalProps {
    onClose: () => void;
    productId: number;
}

const UsageProductModal: React.FC<AddProductModalProps> = ({ onClose, productId }) => {
    const services = useSelector((state: RootState) => getServicesByProductId(state, productId));
    const salesItems = useSelector((state: RootState) => selectSalesItemsByProductId(state, productId));
    const sales = useSelector((state: RootState) => state.sales.valueSales); // Get sales data

    // State for services search and pagination
    const [serviceSearchTerm, setServiceSearchTerm] = useState('');
    const [serviceCurrentPage, setServiceCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // State for salesItems search and pagination
    const [salesSearchTerm, setSalesSearchTerm] = useState('');
    const [salesCurrentPage, setSalesCurrentPage] = useState(1);

    // Filter and paginate services
    const filteredServices = useMemo(
        () => services.filter(service => service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())),
        [services, serviceSearchTerm]
    );
    const serviceTotalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const paginatedServices = filteredServices.slice(
        (serviceCurrentPage - 1) * itemsPerPage,
        serviceCurrentPage * itemsPerPage
    );

    // Filter and paginate sales items
    const filteredSalesItems = useMemo(
        () => salesItems.filter(item => item.name.toLowerCase().includes(salesSearchTerm.toLowerCase())),
        [salesItems, salesSearchTerm]
    );
    const salesTotalPages = Math.ceil(filteredSalesItems.length / itemsPerPage);
    const paginatedSalesItems = filteredSalesItems.slice(
        (salesCurrentPage - 1) * itemsPerPage,
        salesCurrentPage * itemsPerPage
    );

    // Handlers for pagination and search
    const handleServicePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= serviceTotalPages) {
            setServiceCurrentPage(newPage);
        }
    };
    const handleSalesPageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= salesTotalPages) {
            setSalesCurrentPage(newPage);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[50%] relative flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-[-12px] mr-[-12px] w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white z-50"
                    aria-label="Close Modal"
                >
                    <FaPlus className="transform rotate-45" />
                </button>

                <div className="w-full border-b-2">
                    <h2 className="text-xl font-semibold mb-4">Services Using This Product</h2>
                </div>
                <div className="flex mt-2">
                    {/* Service List with Search and Pagination */}
                    <div className="pr-4 mr-6 border-r">
                        <TextView text="Service List" className="text-2xl" />
                        <InputText
                            type="text"
                            placeholder="Search services..."
                            value={serviceSearchTerm}
                            onChange={(e) => { setServiceSearchTerm(e.target.value); setServiceCurrentPage(1); }}

                        />
                        <div className={`mt-2`}>
                            {paginatedServices.length > 0 ? (
                                paginatedServices.map(service => (
                                    <div key={service.id} className="mb-4 p-4 border border-emerald-500 bg-gray-100">
                                        <h3 className="text-lg font-semibold">{service.name}</h3>
                                        {service.serviceProductUsed?.filter(product => product.id === productId).map(filteredProduct => (
                                            <div key={filteredProduct.id} className="text-sm text-gray-600">
                                                <p><strong>Quantity this service uses:</strong> {filteredProduct.amt}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <p>No services available for this product.</p>
                            )}
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => handleServicePageChange(serviceCurrentPage - 1)}
                                disabled={serviceCurrentPage === 1}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Previous
                            </button>
                            <span>Page {serviceCurrentPage} of {serviceTotalPages}</span>
                            <button
                                onClick={() => handleServicePageChange(serviceCurrentPage + 1)}
                                disabled={serviceCurrentPage === serviceTotalPages}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    {/* Sales Items List with Search and Pagination */}
                    <div>
                        <TextView text="Actual Usage based on Sales" className="text-2xl" />
                        <InputText
                            type="text"
                            placeholder="Search sales items..."
                            value={salesSearchTerm}
                            onChange={(e) => { setSalesSearchTerm(e.target.value); setSalesCurrentPage(1); }}

                        />
                        {paginatedSalesItems.length > 0 ? (
                            <div className="max-h-96 overflow-y-auto">
                                <ul>
                                    {paginatedSalesItems.map(item => {
                                        const sale = sales[item.salesId];
                                        const relatedService = services.find(service => service.id === item.serviceId);

                                        // Find the product usage for the specific product ID (assuming productId is available in scope)
                                        const productUsage = relatedService?.serviceProductUsed?.find(product => product.id === productId);

                                        return (
                                            <li key={item.id}
                                                className="mb-4 p-4 border-b border-gray-300 flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <p><strong>Sales ID:</strong> {item.salesId}</p>
                                                    <p><strong>Service Name:</strong> {item.name}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    {sale && <p><strong>Date of Sale:</strong> {sale.date}</p>}
                                                    {productUsage &&
                                                        <p><strong>Amount Used:</strong> {productUsage.amt}</p>}
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ) : (
                            <p>No sales items found for this product.</p>
                        )}
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => handleSalesPageChange(salesCurrentPage - 1)}
                                disabled={salesCurrentPage === 1}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Previous
                            </button>
                            <span>Page {salesCurrentPage} of {salesTotalPages}</span>
                            <button
                                onClick={() => handleSalesPageChange(salesCurrentPage + 1)}
                                disabled={salesCurrentPage === salesTotalPages}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsageProductModal;
