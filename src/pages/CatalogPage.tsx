import React, {useContext, useEffect, useState} from 'react';
import TextView from "../components/TextViewComponent/TextView";
import ClientSidebar from "../components/Sidebars/ClientSidebarComponent/ClientSidebar";
import styles from './styles/ClientStyle.module.css';
import InputText from "../components/InputTextComponent/InputText";
import DropdownButton from "../components/DropdownButtonComponent/DropdownButton";
import { useNavigate } from 'react-router-dom';
import {FaPlus, FaBars, FaEllipsisV, FaCalendar} from 'react-icons/fa';
import ClientProfile from "../components/SubClientComponent/ClientProfile";
import AddCategoryModal from "../components/AddCategoryModalComponent/AddCategoryModal";
import { Category } from "../components/AddCategoryModalComponent/AddCategoryModal"
import AddServiceModal from "../components/AddServiceModalComponent/AddServiceModal";
import { Service} from "../types/Service";
import Popover from "../components/PopoverModalComponent/Popover";
import { servicesContext } from "../context/servicesContext";
import { packagesContext } from "../context/packagesContext";
import {Package} from "../types/Package";
import categories from "../testData/categories.json";
import services from "../testData/services.json";
import Button from "../components/ButtonComponent/Button";
const categoryRawData: Category[] = categories;

interface SidebarItem {
    label: string;
    href?: string;
    type: 'link' | 'div';
    id?: string;
    active?: boolean;
}
type ServiceCountMap = {
    [key: string]: number; // or number if category is always a number
};
const CatalogPage: React.FC = () => {
    const   navigate = useNavigate();
    const contextService = useContext(servicesContext);
    const contextPackage = useContext(packagesContext);

    if (!contextService || !contextPackage) {
        throw new Error('AddServiceModal must be used within a ServicesProvider');
    }

    const { valueService, setValueService } = contextService;
    const { valuePackage, setValuePackage } = contextPackage;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [catalogOption, setCatalogOption] = useState<string[]>(['Catalog', 'New Category']);
    const [categoryData, setCategoryData] = useState<Category[]>(categoryRawData?.length ? categoryRawData : []);

    const [serviceCollection, setServiceCollection] = useState<{ [key: number]: Service[] }>(services);
    const [packageCollection, setPackageCollection] = useState<{ [key: string]: Package[] }>({});
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

    const [activeContent, setActiveContent] = useState<React.ReactNode>(<ClientProfile />);
    const [activeItemId, setActiveItemId] = useState<string | null>('clientDetail');
    const sortOptions = ['Created at (Newest first)', 'Created at (Oldest first)'];
    const [editingService, setEditingService] = useState<Service | Package | null>(null);
    const [currStep, setCurrStep] = useState(0 );

    // Monitor if No Category is set Yet
    useEffect(() => {
        if (categoryData.length > 0 && catalogOption.length <= 2)
        {
            setCatalogOption(['Catalog', 'New Service', 'New Category']);
        }
    }, [catalogOption.length, categoryData]);
    useEffect(() => {
        if(!isAddServiceModalOpen)
        {
            setCurrStep(0);
        }

    }, [isAddServiceModalOpen]);
    const handleClick = () => {
        setIsAddCategoryModalOpen(true);
    };

    const sidebarItems: SidebarItem[] = [
        { label: 'Dashboard', href: '/', type: 'link' },
        { label: 'Client List', href: '/clientlist', type: 'link' },
        { label: 'Service/Package', href: '/catalog', type: 'link', active: true },
        { label: 'Product Page', href: '/product', type: 'link'  },
        { label: 'Sales', href: '/sales', type: 'link' },
        { label: 'Team', href: '/team', type: 'link' },
        { label: 'Marketing Kit', href: '/marketing', type: 'link'  },
    ];

    const handleItemClick = (id: string, type: 'link' | 'div') => {
        setActiveItemId(id);
    };

    const handleOptionSelect = (option: string | number | boolean) => {
        if (option === 'New Service') {
            setIsAddServiceModalOpen(true);
        }
    };

    const handleAddCategory = (category: Category) => {
        setCategoryData([...categoryData, category]);
        console.log(categoryData)
    };

    const handleAddService = (service: Service | Package) => {

            if ('category' in service) {  // Type guard to check if service is a Service
                setServiceCollection((prevCollection) => {
                    const newCollection = { ...prevCollection };
                    // Check if the category already exists
                    if (!newCollection[service.category]) {
                        newCollection[service.category] = [];
                    }

                    // Find the index of the existing service, if it exists
                    const existingServiceIndex = newCollection[service.category].findIndex(s => s.id === service.id);

                    if (existingServiceIndex !== -1) {
                        // Update the existing service
                        newCollection[service.category][existingServiceIndex] = service;
                    } else {
                        // Add the new service
                        newCollection[service.category].push(service);
                    }
                        if (contextService) {
                            setValueService(newCollection); // Make sure `setValue` is expecting the correct type
                        }

                    return newCollection;
                });

            } else {
                setPackageCollection((prevCollection) => {
                    const newCollection = { ...prevCollection };

                    const key = service.id;

                    if (!newCollection[key]) {
                        newCollection[key] = [];
                    }

                    newCollection[key].push(service);

                    if (contextPackage) {
                        setValuePackage(newCollection); // Make sure `setValue` is expecting the correct type
                    }
                    return newCollection;
                });
            }
    };


    const handleEditClick = (service: Service) => {
        setCurrStep(1);
        setIsAddServiceModalOpen(true);
        setEditingService(service);
    };
    const handleEditPackageClick = (service: Package) => {
        setCurrStep(2);
        setIsAddServiceModalOpen(true);
        setEditingService(service);
    };

    const handleDeleteClick = (id: string | number) => {
        console.log("Delete clicked " + id);

        // Remove from categoryData
        setCategoryData(prevCategoryData => prevCategoryData.filter(category => category.id !== id));

        // Remove from serviceCollection
        setServiceCollection(prevCollection => {
            const newCollection = { ...prevCollection };
            Object.keys(newCollection).forEach(categoryId => {
                newCollection[parseInt(categoryId)] = newCollection[parseInt(categoryId)].filter(service => service.id !== id);
            });
            return newCollection;
        });
    };
    const serviceCounts = Object.values(serviceCollection).flat().reduce<ServiceCountMap>((acc, service) => {
        // Use the correct property name based on your Service type
        const categoryId = service.category; // Assuming the property name is 'category'
        acc[categoryId] = (acc[categoryId] || 0) + 1; // Increment the count
        return acc;
    }, {});
    return (
        <div id={styles.sub_container} className="flex flex-col lg:flex-row">
            <div className="lg:hidden p-4 flex justify-between items-center">
                <button className="text-2xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <FaBars />
                </button>
                <span className="text-xl">Catalog</span>
            </div>
            <div className={`lg:flex-none lg:p-4 border-r border-r-gray-300 lg:w-1/8 lg:block ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div className={`${isSidebarOpen ? styles.pageLabel + ' hidden' : styles.pageLabel + ' hidden lg:block'}`}>
                    <TextView text="Catalog" />
                </div>
                <ClientSidebar items={sidebarItems} onItemClick={handleItemClick} />
            </div>

            <div className="flex-1 p-4">
                <div id="clientHeading" className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center">
                            <div className={`${styles.pageContentHeading} mr-3`}>
                                <TextView text="Service Menu" />
                            </div>
                        </div>
                        <div>
                            <div className={styles.pageSubText}>
                                <TextView text="View and manage what you offer" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className={`mr-2`}><Button onClick={() => (setIsAddServiceModalOpen(true))}><FaPlus
                            className="mr-2"/>Add Service</Button></div>
                        <div className={`ml-2 mr-2`}><Button onClick={() => (setIsAddProductModalOpen(true))}><FaPlus
                            className="mr-2 ml-2"/>Add New Product</Button>
                        </div>
                        <div className={`ml-2`}><Button onClick={() => (setIsAddCategoryModalOpen(true))}><FaPlus/>Add
                            Category
                        </Button>
                        </div>


                    </div>
                </div>
                <div className={`mt-2p flex items-center justify-between ${styles.clientListSearchSection}`}>
                    <div className="w-1/3">
                    <InputText placeholder="Search Service Name" name="serviceSearch"/>
                    </div>
                    <div>
                        <DropdownButton options={sortOptions} onSelect={handleOptionSelect} defaultSelected={sortOptions[0]} />
                    </div>
                </div>
                <div className="mt-2p">
                    <div className="flex w-full h-full">
                        <div className="w-1/2 flex justify-center">
                            <div className="w-3/4 flex flex-col">
                                <div className="border p-2 w-full h-100 text-left flex flex-col">
                                    <div className="ml-4 mr-4 text-2xl font-bold border-b border-b-gray-400">
                                        <TextView text="Category" />
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        <div className="m-2 pl-4 flex items-center border-l-4">
                                            <div className="w-full flex justify-between">
                                                <div className="mr-3">
                                                    <TextView text="All Categories" />
                                                </div>

                                            </div>
                                        </div>
                                        {categoryData.map((category) => (
                                            <div key={category.id} className={`m-2 pl-4 flex items-center border-l-4`}
                                                 style={{ borderColor: category.appointmentColor }}>
                                                <div className="w-full flex justify-between">
                                                    <div className="mr-3">
                                                        <TextView text={category.name} />
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-black border border-black bg-emerald-50 rounded-full">
                                                             {serviceCounts[category.id] || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleClick}
                                        className="flex items-center space-x-2 px-4 py-2 "
                                    >
                                        <FaPlus className="text-lg" />
                                        <span>Add New Category</span>
                                    </button>
                                </div>
                                <div className="mt-2 border p-2 w-full h-100 text-left flex flex-col">
                                    <div>
                                        test
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div key='packageListing'>
                                <div className="text-2xl font-bold">
                                    Packages Available
                                </div>
                                <div>
                                    {Object.keys(packageCollection).map((id) => {
                                        const packaging = packageCollection[id]; // Access the package by id
                                        return (
                                            <div key={id}>
                                                {/* Render the package data, assuming 's' is an array of packages */}
                                                {packaging.map((service) => (
                                                    <div key={service.id} className={`border mt-2 mb-2 p-2p rounded-md`}
                                                         style={{borderLeftWidth: '8px',
                                                             borderLeftColor: 'rgb(223 198 198)'}}>
                                                        <div className={`flex flex-row`}>
                                                            <div className={`w-1/2`}>
                                                                {service.name} - {service.description}
                                                            </div>
                                                            <div className="w-1/2 ml-auto">
                                                                <div className="flex justify-end items-center">
                                                                    <div className="mr-2">
                                                                        PHP {service.price}
                                                                    </div>
                                                                    <div>
                                                                        <Popover
                                                                            trigger={<FaEllipsisV/>}
                                                                            content={<div>
                                                                                <div
                                                                                    onClick={() => handleEditPackageClick(service)}
                                                                                    style={{
                                                                                        padding: '8px',
                                                                                        cursor: 'pointer'
                                                                                    }}>Edit
                                                                                </div>
                                                                                <div
                                                                                    onClick={() => handleDeleteClick(service.id)}
                                                                                    style={{
                                                                                        padding: '8px',
                                                                                        cursor: 'pointer'
                                                                                    }}>Delete
                                                                                </div>
                                                                            </div>}
                                                                            position="left"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div key='services'>
                                <div className="text-2xl font-bold">
                                    Services Available
                                </div>
                                {Object.keys(serviceCollection).map((categoryId) => {
                                    const services = serviceCollection[parseInt(categoryId)];
                                    const categoryName = categoryData.find(cat => cat.id === parseInt(categoryId))?.name || 'Unknown Category';
                                    return (
                                        <div key={categoryId}>
                                            <div className="text-xl font-bold">
                                                {categoryName}
                                            </div>
                                            <div>
                                                {services.map(service => (
                                                    <div key={service.id} className={`border mt-2 mb-2 p-2p rounded-md`}
                                                         style={{
                                                             borderLeftWidth: '8px',
                                                             borderLeftColor: categoryData[categoryData.findIndex(item => item.id === service.category)].appointmentColor
                                                         }}>
                                                        <div className={`flex flex-row`}>
                                                            <div className={`w-1/2`}>
                                                                {service.name} - {service.description}
                                                            </div>
                                                            <div className="w-1/2 ml-auto">
                                                                <div className="flex justify-end items-center">
                                                                    <div className="mr-2">
                                                                        PHP {service.cost}
                                                                    </div>
                                                                    <div>
                                                                        <Popover
                                                                            trigger={<FaEllipsisV/>}
                                                                            content={<div>
                                                                                <div
                                                                                    onClick={() => handleEditClick(service)}
                                                                                    style={{
                                                                                        padding: '8px',
                                                                                        cursor: 'pointer'
                                                                                    }}>Edit
                                                                                </div>
                                                                                <div
                                                                                    onClick={() => handleDeleteClick(service.id)}
                                                                                    style={{
                                                                                        padding: '8px',
                                                                                        cursor: 'pointer'
                                                                                    }}>Delete
                                                                                </div>
                                                                            </div>}
                                                                            position="left"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {isAddCategoryModalOpen && <AddCategoryModal onClose={() => setIsAddCategoryModalOpen(false)}
                                                         onAddCategory={handleAddCategory}/>}
            {isAddServiceModalOpen && <AddServiceModal onClose={() => setIsAddServiceModalOpen(false)}
                                                       onAddService={handleAddService}
                                                       option={categoryData.map(category => ({
                                                           label: category.name,
                                                           value: category.id
                                                       }))}
                                                       serviceToEdit={editingService}
                                                       forceStep={currStep}
            />}
        </div>
    );
};

export default CatalogPage;
