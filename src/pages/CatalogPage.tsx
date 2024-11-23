import React, {useContext, useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {RootState, AppDispatch} from "../redux/store";
import { addCategory, updateCategory,deleteCategory } from '../redux/slices/serviceCategorySlice';
import TextView from "../components/TextViewComponent/TextView";
import ClientSidebar from "../components/Sidebars/ClientSidebarComponent/ClientSidebar";
import styles from './styles/ClientStyle.module.css';
import InputText from "../components/InputTextComponent/InputText";
import DropdownButton from "../components/DropdownButtonComponent/DropdownButton";
import { useNavigate } from 'react-router-dom';
import {FaPlus, FaBars, FaEllipsisV} from 'react-icons/fa';
import AddCategoryModal from "../components/AddCategoryModalComponent/AddCategoryModal";
import {Category} from "../types/Category";
import AddServiceModal from "../components/AddServiceModalComponent/AddServiceModal";
import { Service} from "../types/Service";
import Popover from "../components/PopoverModalComponent/Popover";
import {Package} from "../types/Package";
import categories from "../testData/categories.json";
import services from "../testData/services.json";
import Button from "../components/ButtonComponent/Button";
import {sidebarItems} from "./menuitems/sidebarItems";

type ServiceCountMap = {
    [key: string]: number; // or number if category is always a number
};
const CatalogPage: React.FC = () => {
    const   navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const categories = useSelector((state: RootState) => state.serviceCategories.categories);
    const services = useSelector((state: RootState) => state.services.valueService || []);
    const packages = useSelector((state: RootState) => state.packages.valuePackage || []);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
    const sortOptions = ['Created at (Newest first)', 'Created at (Oldest first)'];
    const [editingService, setEditingService] = useState<Service | Package | null>(null);
    const [currStep, setCurrStep] = useState(0 );

    const [activeItem, setActiveItem] = useState<string | null>('catalog');
    const [serviceDisabled, setServiceDisabled] = useState<boolean>(true);
    const handleItemClick = (id: string, type: 'link' | 'div') => {
        setActiveItem(id);

        if (type === 'link') {
            const item = sidebarItems.find((item) => item.id === id);
            if (item?.href) {
                navigate(item.href); // Use the `href` value for navigation
            }
        }
    };
    // Monitor if No Category is set Yet
    useEffect(() => {
        if (categories.length > 0 )
        {
            setServiceDisabled(false);
        }
    }, [categories.length]);
    useEffect(() => {
        if(!isAddServiceModalOpen)
        {
            setCurrStep(0);
        }

    }, [isAddServiceModalOpen]);
    const handleClick = () => {

        setIsAddCategoryModalOpen(true);
    };

    const handleOptionSelect = (option: string | number | boolean) => {
        if (option === 'New Service') {
            setIsAddServiceModalOpen(true);
        }
    };

    const handleAddCategory = (category: Category) => {
        dispatch(addCategory(category));
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
        dispatch(deleteCategory(id));

    };
    const serviceCounts = Object.values(services).flat().reduce<ServiceCountMap>((acc, service) => {
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
                <ClientSidebar items={sidebarItems} onItemClick={handleItemClick} activeItem={activeItem} />
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
                        <div className={`mr-2`}><Button  disabled={serviceDisabled} onClick={() => (setIsAddServiceModalOpen(true))}><FaPlus
                            className="mr-2"/>Add Service</Button></div>

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
                                        {categories.map((category) => (
                                            <div key={category.id} className={`m-2 pl-4 flex items-center border-l-4`}
                                                 style={{ borderColor: category?.appointmentColor || 'gray' }}>
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
                                    Package Available
                                </div>
                                <div>
                                    {packages && Object.keys(packages).length > 0 && Object.keys(packages).map((id) => {
                                        const packaging = packages[parseInt(id)]; // Access the package by id

                                        if (!packaging) {
                                            return null; // or handle the undefined case
                                        }
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
                                { services && Object.keys(services).length > 0 && Object.keys(services).map((categoryId) => {
                                    const categoryServices = services[parseInt(categoryId)] || []; // Renamed for clarity
                                    const categoryName = categories.find(cat => cat.id === parseInt(categoryId))?.name || 'Unknown Category';
                                    const categoryColor = categories.find(cat => cat.id === parseInt(categoryId))?.appointmentColor || 'gray';

                                    return (
                                        <div key={categoryId}>
                                            <div className="text-xl font-bold">
                                                {categoryName}
                                            </div>
                                            <div>
                                                {categoryServices.map(service => (
                                                    <div key={service.id} className="border mt-2 mb-2 p-2 rounded-md"
                                                         style={{
                                                             borderLeftWidth: '8px',
                                                             borderLeftColor: categoryColor
                                                         }}>
                                                        <div className="flex flex-row">
                                                            <div className="w-1/2">
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
                                                                            content={
                                                                                <div>
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
                                                                                </div>
                                                                            }
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
                                                         onAddCategory={handleAddCategory} categoryTagging={'service'} />}
            {isAddServiceModalOpen && <AddServiceModal onClose={() => setIsAddServiceModalOpen(false)}
                                                       option={categories.map(category => ({
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
