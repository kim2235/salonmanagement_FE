import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from "../../redux/store";
import { FaBox, FaFolder, FaPlus } from 'react-icons/fa';
import Button from '../ButtonComponent/Button';
import InputText from '../InputTextComponent/InputText';
import TextView from "../TextViewComponent/TextView";
import { v4 as uuidv4 } from 'uuid';
import DropdownButton, { Option } from "../DropdownButtonComponent/DropdownButton";
import TextArea from "../TextAreaComponent/TextArea";
import MultiSelectDropdown from "../MultiSelectDropdownComponent/MultiSelectDropdown";
import { Service, SelectedService } from "../../types/Service";
import { Package } from "../../types/Package";
import pricingOptions from "../../data/pricingOptions.json";
import { generateMicrotime } from "../../utilities/microTimeStamp";
import { addOrUpdateService } from "../../redux/slices/serviceSlice";
import { addOrUpdatePackage } from "../../redux/slices/packageSlice";
import {Category} from "../AddCategoryModalComponent/AddCategoryModal";
import Select from "../SelectComponent/Select";

interface AddServiceModalProps {
    onClose: () => void;
    option: Option[];
    serviceToEdit?: Service | Package | null;
    forceStep?: number;
}

interface ServiceState {
    serviceCategory: number | string;
    serviceDescription: string;
    packageDescription: string;
    aftercareDescription: string;
    serviceCost: number;
    packageCost: number;
    packageDuration: string;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({
                                                             onClose,
                                                             option,
                                                             forceStep = 0,
                                                             serviceToEdit
                                                         }) => {
    const dispatch = useDispatch<AppDispatch>();
    const valueService = useSelector((state: RootState) => state.services.valueService);
    const categories = useSelector((state: RootState) => state.categories.categories); // Access categories from the Redux store

    const [step, setStep] = useState<number>(forceStep);
    const [serviceName, setServiceName] = useState<string>(serviceToEdit ? serviceToEdit.name : '');
    const [packageName, setPackageName] = useState<string>(serviceToEdit ? serviceToEdit.name : '');
    const [additionalInventoryFields, setAdditionalInventoryFields] = useState<unknown[]>([]); // Use `unknown` for type safety

    const [formData, setFormData] = useState<ServiceState>({
        serviceCategory: serviceToEdit?.category || 0,
        serviceDescription: serviceToEdit?.description || '',
        packageDescription: serviceToEdit?.description || '',
        aftercareDescription: serviceToEdit?.aftercareDescription || '',
        serviceCost: serviceToEdit?.cost || 0,
        packageCost: serviceToEdit?.price || 0,
        packageDuration: serviceToEdit?.duration || '',
    });

    const handleInputChange = (name: string) => (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value, // Update the state with the new value
        }));
    };

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [serviceType, setServiceType] = useState<'single' | 'package' | null>(null);
    const [usedService, setUsedService] = useState<SelectedService[]>([]);

    useEffect(() => {
        if (usedService.length > 0) {
            const totalPrice = usedService.reduce((sum, service) => {
                // Ensure service.price is a number; if not, default to 0
                const price = typeof service.price === 'number' ? service.price : Number(service.price) || 0;
                return sum + price;
            }, 0); // Start with 0

            setFormData((prevData) => ({
                ...prevData,
                packageCost: Number(totalPrice.toFixed(2)), // Format totalPrice to two decimal places
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
        const { value } = event.target; // Get the value of the textarea
        setFormData({
            ...formData,
            serviceDescription: value, // Update the state with the new value
        });
    };
    const handlePackageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target; // Get the value of the textarea
        console.log(value)
        setFormData({
            ...formData,
            packageDescription: value, // Update the state with the new value
        });

    };

    const handleAddService = () => {
        const validationErrors = validateForm();
        console.log(formData)
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
            console.log(newPackage)
            handleGoBack();
            onClose();
        }
    };

    const handleNextStep = (type: 'single' | 'package') => {
        setServiceType(type);
        setStep(type === 'single' ? 1 : 2);
    };

    const handleGoBack = () => {
        setStep(0);
    };

    const handleSelectionChange = (selectedServices: Service[]) => {
        const services = selectedServices.map(s => ({
            id: s.id,
            serviceName: s.name,
            category: s.category,
            price: s.cost
        }));
        setUsedService(services);
    };
    const options = categories.map((category: Category) => ({
        label: category.name,  // Assuming Category has a 'name' property
        value: category.id,     // Assuming Category has an 'id' property
    }));

    const addInventoryFields = () => {
        setAdditionalInventoryFields([...additionalInventoryFields, {}, {}]); // Add two new entries
    };

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
                                <Button onClick={() => handleNextStep('single')} size="large">
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
                    <div className="mb-2">
                        <h2 className="text-xl font-semibold mb-4">{serviceToEdit ? 'Edit Service' : 'Add New Service'}</h2>
                        <div className="flex flex-col space-y-4">
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <InputText
                                        name="serviceName"
                                        value={serviceName}
                                        onChange={(e) => setServiceName(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
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
                                    {errors.serviceCategory && <span className="error">{errors.serviceCategory}</span>}
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
                            <hr className="my-4"/>
                            <div className={`flex`}>
                                <h3 className="text-lg font-semibold mb-2">Inventory Setting</h3>
                                <span className={`mt-1.5`}><FaPlus
                                    onClick={addInventoryFields}
                                    className="ml-2 cursor-pointer text-violet-400 hover:text-violet-700"
                                    size={20} // Adjust size as needed
                                /></span>
                            </div>


                            <div className="overflow-y-auto max-h-48"> {/* Set max height here */}
                                {/* Initial Pair of Text Boxes */}
                                <div className="flex space-x-4">
                                    <InputText name="inventory1" placeholder="Inventory"/>
                                    <InputText name="inventory2" placeholder="Quantity Usage" />
                                </div>

                                {/* Render additional input fields if added */}
                                {additionalInventoryFields.map((_, index) => (
                                    <div key={index} className="flex space-x-4 mt-2">
                                        <InputText
                                            name={`additionalInventory${index * 2 + 1}`}
                                            placeholder={`Inventory ${index * 2 + 3}`}
                                        />
                                        <InputText
                                            name={`additionalInventory${index * 2 + 2}`}
                                            placeholder={`Quantity Usage ${index * 2 + 4}`}
                                        />
                                    </div>
                                ))}
                            </div>


                            <Button className="mb-2 mt-4" onClick={handleAddService} size="large">
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
                                                 onSelectionChange={handleSelectionChange}/>
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
