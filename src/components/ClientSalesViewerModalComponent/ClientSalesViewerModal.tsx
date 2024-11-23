import React, { useState } from 'react';
import { Sales } from '../../types/Sales';
import { useDispatch, useSelector } from 'react-redux';
import {RootState, AppDispatch, store} from "../../redux/store";
import Button from "../ButtonComponent/Button";
import {selectSalesItemsBySaleId,updateServiceStatus} from "../../redux/slices/salesItemsSlice";
import {Service} from "../../types/Service";
import {Product} from "../../types/Product";
import {addOrUpdateProduct} from "../../redux/slices/productSlice";
import {selectPackageById} from "../../services/packageServices";
import TextView from "../TextViewComponent/TextView";

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
    const dispatch = useDispatch<AppDispatch>();
    const salesItems = useSelector((state: RootState) => selectSalesItemsBySaleId(state, salesDetails.id));
    const services = useSelector((state: RootState) => state.services.valueService);
    const productsState = useSelector((state: RootState) => state.products.valueProduct);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value); // update state with input value
    };
    const getServiceById = (serviceId: number) => {
        // Loop through all categories to find the service with the given ID
        for (const category in services) {
            const service = services[category].find((s: Service) => s.id === serviceId);
            if (service) return service;
        }
        return null; // Return null if no service is found
    };
    if (!isOpen) return null;

    const handleSave = () => {
        const updatedSales: Sales = {
            ...salesDetails,
            status: Number(inputValue) >= Number(salesDetails.balance) ? 'paid' : 'unpaid',
            payment: Number(inputValue) || 0, // Update the payment with the input value
        };
        onSave(updatedSales);
        onClose();
    };
    const handleMarkAsDone = (serviceId: number,serviceItemId: number) => {
        dispatch(updateServiceStatus({ salesId: salesDetails.id, serviceId, isDone: true }));
        const serviceToMark = getServiceById(serviceItemId);

        serviceToMark?.serviceProductUsed?.forEach((productUsed: { id: number; amt: number }) => {

            Object.keys(productsState).forEach((category) => {
                const products =productsState[category];

                const product = products.find((p: Product) => p.id === productUsed.id);

                if (product) {

                    const updatedProduct: Product = {
                        ...product,
                        stockQuantityRemaining: product.stockQuantityRemaining
                            ? product.stockQuantityRemaining - productUsed.amt
                            : product.stockQuantity - productUsed.amt,
                        stockQuantityUsed: (product?.stockQuantityUsed || 0) + productUsed.amt,
                    };

                    dispatch(addOrUpdateProduct(updatedProduct));

                }
            });
        });
    };
    const getPackageById = (id: string) => {
        const state = store.getState();
        return selectPackageById(state, id);
    };
    return (
        <div className={`fixed inset-0 flex items-start justify-center z-50`}>
            <div className={`absolute inset-0 bg-black opacity-50`} />
            <div className={`bg-white rounded-lg shadow-lg p-6 mt-20 z-10 w-48.5p`}>
                <h2 className={`text-lg font-bold mb-4`}>Sale Details</h2>
                <div className={`mb-4`}>
                    <h3 className={`font-semibold`}>Sale ID: {salesDetails.id}</h3>
                    <h3 className={`font-semibold`}>Client: {salesDetails.client.clientName}</h3>
                    <h3 className={`font-semibold`}>Date: {salesDetails.date}</h3>
                </div>
                <h3 className={`font-semibold mb-2`}>Services:</h3>
                <div className={`overflow-y-auto max-h-60`}>
                    <ul className={`list-none list-inside mb-4`}>
                        Service/Packages that this client avail:
                        {salesItems.map((service) => (
                            <li key={service.id} className={`m-2 border border-emerald-300 p-2`}>
                                <div>
                                    <span className={`font-medium`}>
                                        <TextView text={`Name: `}></TextView>
                                    </span>
                                    <span>
                                        <TextView text={service.name}></TextView>
                                    </span>
                                    <span
                                    onClick={() => !service.isDone && handleMarkAsDone(service.id, service.serviceId)} // Only trigger if not done
                                    className={`ml-2 cursor-pointer text-blue-500 ${service.isDone ? 'line-through text-gray-400 cursor-not-allowed' : ''}`}
                                >
                                {service.isDone ? 'Done' : 'Mark this Done'}
                                </span>
                                </div>
                                <div>
                                    <span className={`font-medium`}>
                                        <TextView text={`Description: `}></TextView>
                                    </span>
                                    <span className={`font-light`}>
                                        <TextView text={service.description}></TextView>
                                    </span>
                                </div>
                                <div>
                                     <span className={`font-medium`}>
                                        <TextView text={`Cost: `}></TextView>
                                    </span>
                                    <span className={`font-light`}>
                                        $ <TextView text={service.cost != null ? service.cost.toString() : '0.00'}></TextView>
                                    </span>
                                </div>


                                {!service.category ? (
                                    getPackageById(service.serviceId.toString()).map((pkg) => (
                                        <div className={``}>
                                            <TextView text={`Package Inclusion: `} className={`font-semibold`}></TextView>
                                            <ul key={pkg.id} className={``}>
                                                {pkg.services.map((selected) => (
                                                    <li key={selected.id}>- {selected.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))
                                ) : null}
                            </li>
                        ))}
                    </ul>

                </div>
                <h3 className={`font-semibold`}> Total:
                    ${salesDetails.total ? salesDetails.total.toFixed(2) : '0.00'}</h3>

                {salesDetails.status === 'paid' && (
                    <div className={`mt-4`}>
                        <label className={`block mb-2 font-semibold`} htmlFor="inputField">
                            Paid Amount:
                        </label>
                            <input
                                type="text"
                                id="inputField"
                                value={salesDetails.payment}
                                className={`pointer-events-none border bg-gray-200 border-gray-300 rounded-lg py-2 px-4 w-full disabled`}
                                placeholder="Enter amount"
                            />
                        </div>
                    )}

                    {/* Conditional rendering of the input box */}
                    {salesDetails.status === 'unpaid' && (
                        <div className={`mt-4`}>
                            <label className={`block mb-2 font-semibold`} htmlFor="inputField">
                                Enter Payment Amount:
                            </label>
                            <input
                                type="number"
                                id="inputField"
                                value={inputValue}
                                onChange={handleChange}
                                className={`border border-gray-300 rounded-lg py-2 px-4 w-full`}
                                placeholder="Enter amount"
                            />
                        </div>
                    )}


                {/* Save button */}
                {salesDetails.status === 'unpaid' && (
                    <Button
                        className={`mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded`}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                )}

                <Button
                    className={`mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded`}
                    onClick={onClose}
                >
                    Close
                </Button>
            </div>
        </div>
    );
};

export default ClientSalesViewerModal;
