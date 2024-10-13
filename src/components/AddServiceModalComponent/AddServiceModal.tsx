import React, {useState, useContext, useEffect} from 'react';
import { FaBox, FaFolder, FaPlus } from 'react-icons/fa';
import Button from '../ButtonComponent/Button';
import InputText from '../InputTextComponent/InputText';
import TextView from "../TextViewComponent/TextView";
import { v4 as uuidv4 } from 'uuid';
import DropdownButton, { Option } from "../DropdownButtonComponent/DropdownButton";
import TextArea from "../TextAreaComponent/TextArea";
import MultiSelectDropdown from "../MultiSelectDropdownComponent/MultiSelectDropdown";
import { servicesContext } from "../../context/servicesContext";
import { packagesContext} from "../../context/packagesContext";
import { Service, SelectedService} from "../../types/Service";
import { Package} from "../../types/Package";
import pricingOptions from "../../data/pricingOptions.json";
import { generateMicrotime} from "../../utilities/microTimeStamp";

interface AddServiceModalProps {
    onClose: () => void;
    option: Option[];
    onAddService: (service: Service | Package) => void;
    serviceToEdit?: Service | Package| null;
    forceStep?: number;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ onClose, onAddService,  option, forceStep = 0, serviceToEdit }) => {
    const contextService = useContext(servicesContext);
    const contextPackage = useContext(packagesContext);

    if (!contextService || !contextPackage) {
        throw new Error('AddServiceModal must be used within a ServicesProvider');
    }

    const { valueService } = contextService; // Get the Values of Current services.json
    const { valuePackage } = contextPackage; // Get the Values of Current services.json

    const [step, setStep] = useState<number>(forceStep); // 0: Initial Buttons, 1: Form
    const [serviceName, setServiceName] = useState<string>(serviceToEdit ? serviceToEdit.name : '');
    const [packageName, setPackageName] = useState<string>(serviceToEdit ? serviceToEdit.name : '');
    const [serviceCategory, setServiceCategory] = useState<number>(() => {
        if (serviceToEdit && 'category' in serviceToEdit) {
            return serviceToEdit.category;
        }
        return 0;
    });
    const [serviceDescription, setServiceDescription] = useState<string>(serviceToEdit ? serviceToEdit.description : '');
    const [packageDescription, setPackageDescription] = useState<string>(serviceToEdit ? serviceToEdit.description : '');
    const [aftercareDescription, setAftercareDescription] = useState<string>(() => {
        if (serviceToEdit && 'aftercareDescription' in serviceToEdit) {
            return serviceToEdit.aftercareDescription;
        }
        return '';
    });
    const [serviceCost, setServiceCost] = useState<number>(() => {
        if (serviceToEdit && 'cost' in serviceToEdit) {
            return serviceToEdit.cost;
        }
        return 0;
    });
    const [packageCost, setPackageCost] = useState<string | number>(() => {
        if (serviceToEdit && 'price' in serviceToEdit) {
            return serviceToEdit.price;
        }
        return '';
    });
    const [packageDuration, setPackageDuration] = useState<string>(() => {
        if (serviceToEdit && 'duration' in serviceToEdit) {
            return serviceToEdit.duration;
        }
        return '';
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [serviceType, setServiceType] = useState<'single' | 'package' | null>(null);
    const [usedService, setUsedService] = useState<SelectedService[]>([]);
    const [pricingType, setPricingType] = useState<string>('');

    useEffect(() => {
        if (setUsedService.length > 0 )
        {
            const totalPrice = usedService.reduce((sum, service) => sum + service.price, 0).toFixed(2);
            setPackageCost(totalPrice.toString());
        }
    }, [ usedService]);
    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};
        if(Number(step) === 1){
            if (!serviceName.trim()) newErrors.serviceName = 'Service name is required';
            if (serviceCategory === 0) newErrors.serviceCategory = 'Service category is required';
            if (!serviceDescription.trim()) newErrors.serviceDescription = 'Service description is required';
            if (serviceCost <= 0) newErrors.serviceCost = 'Service cost must be greater than 0';
        }
        return newErrors;
    };

    const handleAddService = () => {
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const newService: Service = {
                id: serviceToEdit ? serviceToEdit.id : generateMicrotime(),
                name: serviceName,
                category: serviceCategory,
                description: serviceDescription,
                aftercareDescription,
                cost: serviceCost,
                created_at: serviceToEdit ? serviceToEdit.created_at : new Date().toISOString(),
            };
            onAddService(newService);
            handleGoBack();
            onClose();
        }
    };
    const handleAddPackage = () => {
        const validationErrors = validateFields();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const newPackage: Package = {
                id: serviceToEdit ? serviceToEdit.id : generateMicrotime(),
                name: packageName,
                description: packageDescription,
                services: usedService,
                pricingType:pricingType,
                price: Number(packageCost),
                duration: packageDuration,
                created_at: serviceToEdit ? serviceToEdit.created_at : new Date().toISOString(),
            };
            onAddService(newPackage);

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
            })
        );
        setUsedService(services);
    };
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[950px] relative"> {/* Larger width */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-[-12px] mr-[-12px] w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white z-50"
                >
                    <FaPlus className="transform rotate-45" />
                </button>

                {step === 0 ? (
                    <div>
                        <div className={`text-center mb-3.5`}>
                            <TextView text="Choose a Service Type" className={`text-2xl`} />
                        </div>
                        <div className="flex justify-between mb-4">
                            <div
                                className={`w-1/2 border border-4 border-green-400 rounded-md hover:border-green-200 p-5 m-4`}>
                                <Button onClick={() => handleNextStep('single')} size="large">
                                    <FaFolder/><span className={`ml-4`}>Single Service</span>
                                </Button>
                                <div className={`m-4`}>
                                    <TextView text="Service which can be booked individually" className={`text-md`}/>
                                </div>
                            </div>
                            <div
                                className={`w-1/2 border border-4 rounded-md p-5 m-4 ${
                                    Object.keys(valueService).length === 0 ? 'border-gray-400 opacity-50 cursor-not-allowed' : 'border-green-400 hover:border-green-200'
                                }`}
                            >
                                <Button
                                    onClick={() => handleNextStep('package')}
                                    size="large"
                                    disabled={Object.keys(valueService).length === 0} // Disable the button when value is empty
                                >
                                    <FaBox/>
                                    <span className="ml-4">Package</span>
                                </Button>
                                <div className="m-4">
                                    <TextView text="Multiple services grouped in one appointment" className="text-md"/>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : step === 1 ? (
                    <div key={serviceType}>
                        <h2 className="text-xl font-semibold mb-4">{serviceToEdit ? 'Edit Service' : 'Add New Service'}</h2>
                        <div className="flex flex-col space-y-4">
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <InputText
                                        type="text"
                                        placeholder="Service Name"
                                        value={serviceName}
                                        onChange={(e) => setServiceName(e.target.value)}
                                    />
                                    {errors.serviceName && <span className="text-red-500 text-sm">{errors.serviceName}</span>}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <label htmlFor="serviceCategory" className="text-sm font-medium mb-1">Service Category</label>
                                        <DropdownButton
                                            id="serviceCategory"
                                            options={option}
                                            onSelect={(selectedOption) => setServiceCategory(Number(selectedOption))}
                                            placeholder="Select a category"
                                        />
                                    </div>
                                    {errors.serviceCategory && <span className="text-red-500 text-sm">{errors.serviceCategory}</span>}
                                </div>
                            </div>
                            <TextArea
                                placeholder="Service Description"
                                rows={4}
                                value={serviceDescription}
                                onChange={(e) => setServiceDescription(e.target.value)}
                            />
                            {errors.serviceDescription && <span className="text-red-500 text-sm">{errors.serviceDescription}</span>}
                            <TextArea
                                placeholder="Aftercare Description"
                                rows={4}
                                value={aftercareDescription}
                                onChange={(e) => setAftercareDescription(e.target.value)}
                            />
                            <div className="flex flex-col">
                                <div className={`w-full`}>
                                    <TextView text={`Service Cost`} className={`font-medium`} />
                                </div>
                                <div className={`flex space-x-4`}>
                                    <div className="flex-1">
                                        <InputText
                                            type="number"
                                            placeholder="Service Cost"
                                            value={serviceCost}
                                            onChange={(e) => setServiceCost(Number(e.target.value))}
                                        />
                                        {errors.serviceCost && <span className="text-red-500 text-sm">{errors.serviceCost}</span>}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <TextView text={`PHP`} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <div className="m-2">
                                    <Button onClick={handleAddService} size="medium">
                                        {serviceToEdit ? 'Save Changes' : 'Add Service'}
                                    </Button>
                                </div>
                                <div className="m-2">
                                    <Button onClick={handleGoBack} size="medium" variant="transparent">
                                        Go Back
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div key={serviceType}>
                        <h2 className="text-xl font-semibold mb-4">
                            {serviceToEdit ? 'Edit Package' : 'Add New Package'}
                        </h2>
                        <div className="flex flex-col space-y-4">
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <InputText
                                        type="text"
                                        placeholder="Package Name"
                                        value={packageName}
                                        onChange={(e) => setPackageName(e.target.value)}
                                    />
                                    {errors.packageName &&
                                        <span className="text-red-500 text-sm">{errors.packageName}</span>}
                                </div>

                            </div>
                            <TextArea
                                placeholder="Package Description"
                                rows={4}
                                value={packageDescription}
                                onChange={(e) => setPackageDescription(e.target.value)}
                            />
                            {errors.packageDescription &&
                                <span className="text-red-500 text-sm">{errors.packageDescription}</span>}

                            <div className="flex flex-col">
                                <div>
                                    <MultiSelectDropdown servicesByCategory={valueService}
                                                         onSelectionChange={handleSelectionChange}/>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className={`w-full`}>
                                    <TextView text={`Pricing`} className={`font-bold`}/>
                                </div>
                                <div className={`flex flex-col space-x-4 mt-2`}>
                                    <div className="flex flex-row  space-x-2">
                                        <div className="flex flex-col ">
                                            <div className={`mb-2`}>
                                                <TextView text={`Pricing Type`} className={`text-left font-medium`}/>
                                            </div>
                                            <div>
                                                <DropdownButton
                                                    id="serviceCategory"
                                                    options={pricingOptions}
                                                    defaultSelected={'Service pricing'}
                                                    onSelect={(selectedOption) => setPricingType(selectedOption.toString())}
                                                    placeholder="Select Pricing Type"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col ">
                                            <div className={`mb-2`}>
                                                 <TextView text={`Duration`} className={`text-left font-medium`}/>
                                                <span className={`ml-2`}>
                                                    <TextView text={`(Please add month, day, hrs or minute as suffix to the duration)`} className={`text-left text-xs`}/>
                                                </span>
                                            </div>
                                            <div className={`w-48.5p`}>
                                            <InputText
                                                    type="text"
                                                    placeholder="10 days"
                                                    value={packageDuration}
                                                    onChange={(e) => setPackageDuration(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`flex mt-2`}>

                                        <div className="flex-1">
                                            <InputText
                                                type="text"
                                                placeholder="P 0.00"
                                                value={packageCost}
                                                onChange={(e) => setPackageCost(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="flex justify-center">
                                <div className="m-2">
                                    <Button onClick={handleAddPackage} size="medium">
                                        {serviceToEdit ? 'Save Changes' : 'Add Package'}
                                    </Button>
                                </div>
                                <div className="m-2">
                                    <Button onClick={handleGoBack} size="medium" variant="transparent">
                                        Go Back
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddServiceModal;
