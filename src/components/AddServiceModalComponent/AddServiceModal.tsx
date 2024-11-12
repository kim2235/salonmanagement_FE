import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from "../../redux/store";
import {FaBox, FaFolder, FaPlus, FaTimes} from 'react-icons/fa';
import Button from '../ButtonComponent/Button';
import InputText from '../InputTextComponent/InputText';
import TextView from "../TextViewComponent/TextView";
import DropdownButton, { Option } from "../DropdownButtonComponent/DropdownButton";
import TextArea from "../TextAreaComponent/TextArea";
import MultiSelectDropdown from "../MultiSelectDropdownComponent/MultiSelectDropdown";
import { Service, SelectedService } from "../../types/Service";
import { Package } from "../../types/Package";
import pricingOptions from "../../data/pricingOptions.json";
import { generateMicrotime } from "../../utilities/microTimeStamp";
import { addOrUpdateService } from "../../redux/slices/serviceSlice";
import { addOrUpdatePackage } from "../../redux/slices/packageSlice";
import {Category} from "../../types/Category";
import Select from "../SelectComponent/Select";

import {selectFlatProducts} from "../../redux/selectors/productSelectors";
import {Product} from "../../types/Product";

interface AddServiceModalProps {
    onClose: () => void;
    option: Option[];
    serviceToEdit?: Service | Package | null;
    forceStep?: number;
}

interface ServiceState {
    serviceCategory: number | string;
    serviceInventory?: number | string;
    productQuantity?: number ;
    serviceDescription: string;
    packageDescription: string;
    aftercareDescription: string;
    serviceCost: number;
    packageCost: number;
    packageDuration: string;
    inventoryFields: Array<{ id: number; name: string; amt: number }>;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({
                                                             onClose,
                                                             option,
                                                             forceStep = 0,
                                                             serviceToEdit
                                                         }) => {
    const dispatch = useDispatch<AppDispatch>();
    const valueService = useSelector((state: RootState) => state.services.valueService);
    const valuePackage = useSelector((state: RootState) => state.packages.valuePackage);
    const categories = useSelector((state: RootState) => state.serviceCategories.categories); // Access categories from the Redux store

    const [step, setStep] = useState<number>(forceStep);
    const [serviceName, setServiceName] = useState<string>(serviceToEdit ? serviceToEdit.name : '');
    const [packageName, setPackageName] = useState<string>(serviceToEdit ? serviceToEdit.name : '');

    const [formData, setFormData] = useState<ServiceState>({
        serviceCategory: serviceToEdit?.category || 0,
        serviceDescription: serviceToEdit?.description || '',
        packageDescription: serviceToEdit?.description || '',
        aftercareDescription: serviceToEdit?.aftercareDescription || '',
        serviceCost: serviceToEdit?.cost || 0,
        packageCost: serviceToEdit?.price || 0,
        packageDuration: serviceToEdit?.duration || '',
        inventoryFields: [{ id: 0, name: '', amt: 1 }],
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [serviceDefault, setServiceDefault] = useState<any>([]);
    const [usedService, setUsedService] = useState<SelectedService[]>([]);

    const products = useSelector(selectFlatProducts);

    useEffect(() => {
        if(serviceToEdit?.id && !serviceToEdit.category ) {

            const selectedPackage = valuePackage[serviceToEdit.id];
            const selectedService = selectedPackage.map(pkg => pkg.services);
            setServiceDefault(selectedService[0]);
        }
    }, [serviceToEdit, valuePackage]);

    useEffect(() => {
        if(serviceToEdit?.id && serviceToEdit.category) {

            const selectedCategory = valueService[serviceToEdit.category];
            const selectService = selectedCategory.find(service => service.id === serviceToEdit.id)?.serviceProductUsed
            if (selectService) {
                // Update the formData with the selected inventory fields
                setFormData(prevFormData => ({
                    ...prevFormData,
                    inventoryFields: selectService // Populate with `selectService`
                }));
            }
        }
    }, [serviceToEdit, valueService]);

    const findProductById = (id: string | number): Product | undefined => {
        return products.find((product) => product.id === id);
    };

    const productOptions = products.map(product => ({
        value: product.id,
        label: product.name
    }));

    const addInventoryFields = () => {
        setFormData(prevData => ({
            ...prevData,
            inventoryFields: [
                ...prevData.inventoryFields,
                { id: 0, name: '', amt: 1 } 
            ]
        }));
    };


    const handleInputChange = (name: keyof ServiceState, index?: number) =>
        (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
            const { value } = event.target;

            setFormData((prevData) => {
                const updatedData = { ...prevData };

                // Check if we are updating inventoryFields specifically
                if (name === 'serviceInventory' || name === 'productQuantity') {
                    if (index !== undefined && updatedData.inventoryFields[index]) {
                        const selectedProduct = products.find(product => product.id === Number(value));
                        const productName = selectedProduct ? selectedProduct.name : '';
                        const quantity = name === 'productQuantity' ? Number(value) : Number(updatedData.inventoryFields[index].amt) || 1;

                        // Update the inventoryFields array at the given index
                        updatedData.inventoryFields = [...updatedData.inventoryFields];
                        updatedData.inventoryFields[index] = {
                            id: Number(updatedData.inventoryFields[index].id || value),
                            name: productName,
                            amt: quantity,
                        };
                    }
                } else {
                    // For other fields, use type-safe assignments
                    if (name === 'serviceCategory' && typeof value === 'string') {
                        updatedData.serviceCategory = value;
                    } else if (name === 'serviceCost' && !isNaN(Number(value))) {
                        updatedData.serviceCost = Number(value);
                    } else if (name === 'serviceDescription' && typeof value === 'string') {
                        updatedData.serviceDescription = value;
                    }
                    // Add similar conditions for other fields as needed.
                }

                return updatedData;
            });
        };

    useEffect(() => {

        if (usedService && usedService.length > 0) {
            const totalPrice = usedService.reduce((sum, service) => {

                const price = typeof service.price === 'number' ? service.price : Number(service.price) || 0;
                return sum + price;
            }, 0);

            setFormData((prevData) => ({
                ...prevData,
                packageCost: Number(totalPrice.toFixed(2)),
            }));
        }
    }, [usedService]);



    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!serviceName.trim()) newErrors.serviceName = 'Service name is required';
            if (formData.serviceCategory === 0) newErrors.serviceCategory = 'Service category is required';
            if (formData.serviceDescription === '') newErrors.serviceDescription = 'Service description is required';
            if (formData.serviceCost <= 0) newErrors.serviceCost = 'Service cost must be greater than 0';
        }

        return newErrors;
    };
    const handleServiceChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setFormData({
            ...formData,
            serviceDescription: value,
        });
    };
    const handlePackageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setFormData({
            ...formData,
            packageDescription: value,
        });

    };

    const handleAddService = () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const newService: Service = {
                id: serviceToEdit ? serviceToEdit.id : generateMicrotime(),
                name: serviceName,
                category: formData.serviceCategory,
                description: formData.serviceDescription,
                aftercareDescription: formData.aftercareDescription,
                cost: formData.serviceCost,
                created_at: serviceToEdit ? serviceToEdit.created_at : new Date().toISOString(),
                serviceProductUsed: formData.inventoryFields
            };

            dispatch(addOrUpdateService(newService));
            onClose();
        }
    };

    const handleAddPackage = () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const newPackage: Package = {
                id: serviceToEdit ? serviceToEdit.id : generateMicrotime(),
                name: packageName,
                description: formData.packageDescription,
                services: usedService,
                pricingType: '', // Set this as needed
                price: Number(formData.packageCost),
                duration: formData.packageDuration,
                created_at: serviceToEdit ? serviceToEdit.created_at : new Date().toISOString(),
            };

            dispatch(addOrUpdatePackage(newPackage));

            handleGoBack();
            onClose();
        }
    };

    const handleNextStep = (type: 'service' | 'package') => {

        setStep(type === 'service' ? 1 : 2);
    };

    const handleGoBack = () => {
        setStep(0);
    };

    const handleSelectionChange = (selectedServices: Service[]) => {
        const services = selectedServices.map(s => {
            console.log(s); // Log each service as it's being mapped
            return {
                id: s.id,
                name: s.name,
                category: s.category,
                price: s.price || s.cost
            };
        });
        setUsedService(services);
    };

    const removeInventoryField = (index: number) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            inventoryFields: prevFormData.inventoryFields.filter((_, i) => i !== index)
        }));
    };

    const options = categories.map((category: Category) => ({
        label: category.name,  // Assuming Category has a 'name' property
        value: category.id,     // Assuming Category has an 'id' property
    }));

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[950px] relative">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-[-12px] mr-[-12px] w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white z-50"
                >
                    <FaPlus className="transform rotate-45" />
                </button>

                {step === 0 ? (
                    <div>
                        <div className="text-center mb-3.5">
                            <TextView text="Choose a Service Type" className="text-2xl" />
                        </div>
                        <div className="flex justify-between mb-4">
                            <div className="w-1/2 border border-4 border-green-400 rounded-md hover:border-green-200 p-5 m-4">
                                <Button onClick={() => handleNextStep('service')} size="large">
                                    <FaFolder /><span className="ml-4">Single Service</span>
                                </Button>
                                <div className="m-4">
                                    <TextView text="Service which can be booked individually" className="text-md" />
                                </div>
                            </div>
                            <div className={`w-1/2 border border-4 rounded-md p-5 m-4 ${
                                Object.keys(valueService).length === 0 ? 'border-gray-400 opacity-50 cursor-not-allowed' : 'border-green-400 hover:border-green-200'
                            }`}>
                                <Button
                                    onClick={() => handleNextStep('package')}
                                    size="large"
                                    disabled={Object.keys(valueService).length === 0}
                                >
                                    <FaBox />
                                    <span className="ml-4">Package</span>
                                </Button>
                                <div className="m-4">
                                    <TextView text="Multiple services grouped in one appointment" className="text-md" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : step === 1 ? (
                    <div className={`mb-2`}>
                        <h2 className={`text-xl font-semibold mb-4`}>
                            {serviceToEdit ? 'Edit Service' : 'Add New Service'}
                        </h2>
                        <div className={`flex flex-col space-y-4`}>
                            <div className={`flex space-x-4`}>
                                <div className={`flex-1`}>
                                    <InputText
                                        name="serviceName"
                                        value={serviceName}
                                        onChange={(e) => setServiceName(e.target.value)}
                                    />
                                </div>
                                <div className={`flex-1`}>
                                    <Select
                                        id="serviceCategory"
                                        value={formData.serviceCategory}
                                        onChange={(e) => handleInputChange("serviceCategory")(e)}
                                    >
                                        <option value="0">Select a Category</option>
                                        {options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                    {errors.serviceCategory &&
                                        <span className={`error`}>{errors.serviceCategory}</span>}
                                </div>
                            </div>

                            <TextArea
                                value={formData.serviceDescription}
                                onChange={handleServiceChange}
                            />

                            <InputText
                                name="serviceCost"
                                type="number"
                                value={formData.serviceCost}
                                onChange={handleInputChange("serviceCost")}
                            />

                            {/* Divider and Inventory Setting Label */}
                            <hr className={`my-4`}/>
                            <div className={`flex`}>
                                <h3 className={`text-lg font-semibold mb-2`}>Inventory Setting</h3>
                                <span className={`mt-1.5`}>
                                    <FaPlus
                                        onClick={addInventoryFields}
                                        className={`ml-2 cursor-pointer text-violet-400 hover:text-violet-700`}
                                        size={20} // Adjust size as needed
                                    />
                                </span>
                            </div>


                            <div className={`overflow-y-auto max-h-48`}>
                                {formData.inventoryFields.map((field, index) => (
                                    <div key={index} className={`flex space-x-4 mb-2`}>
                                        <div className="w-1/2 relative">
                                            <Select
                                                id={`serviceInventory-${index}`}
                                                value={field.id || ''}
                                                onChange={(e) => handleInputChange("serviceInventory", index)(e)}
                                            >
                                                <option value="0">Select a Product</option>
                                                {productOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="w-1/2">
                                            <InputText
                                                name={`productQuantity-${index}`}
                                                placeholder="Quantity Usage"
                                                value={field.amt || ''}
                                                onChange={(e) => handleInputChange("productQuantity", index)(e)}
                                            />
                                        </div>
                                        <div className="w-fit">
                                            <FaTimes
                                                onClick={() => removeInventoryField(index)}
                                                className="ml-2 cursor-pointer text-red-400 hover:text-red-700"
                                                size={20} // Adjust size as needed
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button className={`mb-2 mt-4`} onClick={handleAddService} size="large">
                            {serviceToEdit ? 'Update Service' : 'Add Service'}
                            </Button>
                        </div>
                    </div>


                ) : (
                    <div className={`mb-2`}>
                        <h2 className="text-xl font-semibold mb-4">{serviceToEdit ? 'Edit Package' : 'Add New Package'}</h2>
                        <div className="flex flex-col space-y-4">
                            <InputText
                                name="packageName"
                                value={packageName}
                                onChange={(e) => setPackageName(e.target.value)}

                            />
                            <TextArea
                                value={formData.packageDescription}
                                onChange={handlePackageChange}
                            />
                            <MultiSelectDropdown servicesByCategory={valueService}
                                                 onSelectionChange={handleSelectionChange}
                                                 defaultSelectedServices={serviceDefault}
                            />
                            <InputText
                                name="packageCost"
                                type="number"
                                value={formData.packageCost}
                                onChange={handleInputChange("packageCost")}

                            />
                            <Button onClick={handleAddPackage} size="large">
                                {serviceToEdit ? 'Update Package' : 'Add Package'}
                            </Button>
                        </div>
                    </div>
                )}
                <Button onClick={handleGoBack} size="large">
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default AddServiceModal;
