import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {RootState, AppDispatch, store} from "../redux/store";
import TextView from "../components/TextViewComponent/TextView";
import Button from "../components/ButtonComponent/Button";
import ClientSidebar from "../components/Sidebars/ClientSidebarComponent/ClientSidebar";
import styles from './styles/ClientStyle.module.css';
import InputText from "../components/InputTextComponent/InputText";
import DropdownButton from "../components/DropdownButtonComponent/DropdownButton";

import Avatar from "../components/AvatarComponent/Avatar";
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import {FaPlus, FaBars, FaChevronRight, FaEllipsisV, FaMoneyBill, FaCoins, FaTrash} from 'react-icons/fa';
import ClientProfile from "../components/SubClientComponent/ClientProfile";
import sales from "../testData/sales.json";
import {addOrUpdateSale} from "../redux/slices/salesSlice";
import {addOrUpdateSalesItem} from "../redux/slices/salesItemsSlice";
import clientList from "../testData/clientList.json";
import {Category} from "../types/Category";
import NotificationModal from "../components/NotificationModalComponent/NotificationModal"
import {Service} from "../types/Service";
import {Sales, SalesItems} from "../types/Sales";
import Popover from "../components/PopoverModalComponent/Popover";
import {Client, SelectedClient} from "../types/Client";

import ClientSalesViewerModal from "../components/ClientSalesViewerModalComponent/ClientSalesViewerModal";
import {generateMicrotime} from "../utilities/microTimeStamp";
import {sidebarItems} from "./menuitems/sidebarItems";
import {Package} from "../types/Package";
import {selectPackageById} from "../services/packageServices";
import {formatDate} from "../utilities/dateFormatting";


const salesData = sales

const SalesPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const valueService = useSelector((state: RootState) => state.services.valueService);
    const valueSales = useSelector((state: RootState) => state.sales.valueSales);
    const packages = useSelector((state:RootState) => state.packages.valuePackage);
    const products = useSelector((state:RootState) => state.products.valueProduct);
    const categories = useSelector((state: RootState) => state.serviceCategories.categories);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedClient, setSelectedClient] = useState<SelectedClient[] | null>();
    const [addSales, setSales] = useState<any>(null);
    const [salesSearch, setSalesSearch] = useState<any>(null);
    const [selectedOption, setSelectedOption] = useState< string | number | boolean | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [categoryData, setCategoryData] = useState<Category[]>();
    const [servicesData, setServicesData] = useState<Service[]>();
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [activePayment, setPayment] = useState<number | null>(null);
    const clientsPerPage = 5;
    const cartNav = ['Services', 'Packages','Products'];
    const [fade, setFade] = useState<boolean>(false);
    const [hidden, setHidden] = useState<boolean>(false);

    const [cartItems, setCartItems] = useState<SalesItems[]>([]);
    const [isClientView, setIsClientView] = useState<boolean>(false); // Tracks whether to show the empty div or the cart
    const [paymentSelected, setPaymentSelected] = useState<string | null>(null);
    const [encodedCash, setEncodedCash] = useState<string | null>(null);

    const [selectedSales, setSelectedSales] = useState<Sales | null>(null);
    const [notificationModalOpen, setNotificationModalOpen] = useState(false);
    const [salesViewerModalOpen, setSalesViewerModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);
    const [message, setMessage] = useState('');
    const [activeItem, setActiveItem] = useState<string | null>('sales');

    const handleItemClick = (id: string, type: 'link' | 'div') => {
        setActiveItem(id);
        if (type === 'link') {
            navigate(id);
        }
    };
    const showSuccess = () => {
        setIsSuccess(true);
        setMessage('Transaction completed successfully!');
        setNotificationModalOpen(true);
    };
    const getPackageById = (id: string) => {
        const state = store.getState();
        return selectPackageById(state, id);
    };
    const showError = () => {
        setIsSuccess(false);
        setMessage('Transaction failed. Please try again.');
        setNotificationModalOpen(true);
    };
    const handleAddClientClick = () => {
        setIsClientView(true);
    };

    const handleSelectClientClick = (client : Client) => {
        const selectedClient : SelectedClient = {
            id: client.id,
            clientName: client.firstName + " " + client.lastName,
            email: client.email
        }
        setSelectedClient([selectedClient] );
        setIsClientView(false);
    };

    const handleGoBackClick = () => {
        setIsClientView(false); // Switch back to the cart view when clicked
    };
    const handleSetSalesItems = () => {
        let status = 'paid'
        if (!selectedClient || selectedClient.length === 0) {
            console.error("No client selected");
            return; // Exit the function if no client is selected
        }

        if((Number(encodedCash) ?? 0 ) < cartItems.reduce((acc, service) => Number(acc) + Number(service.cost), 0) * 1.12){
            status='unpaid';
        }
        let counter = 0;
        const salesId = generateMicrotime();
        const salesItems = {
            id: salesId,
            client: selectedClient[0],
            services: cartItems.map((service) => ({
                id: Number(`${generateMicrotime()}${counter++}`),
                serviceId: service.id,
                salesId: salesId,
                name: service.name,
                cost: service.cost,
                category: service.category,
                description: service.description,
                isDone: false,
                appointmentColor: categoryData?.find(cat => cat.id === service.category)?.appointmentColor
            })),
            subtotal: cartItems.reduce((acc, service) => Number(acc) + Number(service.cost), 0),
            tax: cartItems.reduce((acc, service) => Number(acc) + Number(service.cost), 0) * 0.12,
            total: cartItems.reduce((acc, service) => Number(acc) + Number(service.cost), 0) * 1.12,
            payment: paymentSelected ? encodedCash : null,
            status: status,
            balance: (status === 'paid')? 0 : (cartItems.reduce((acc, service) => Number(acc) + Number(service.cost), 0) * 1.12) - (Number(encodedCash) ?? 0),
            date: formatDate(new Date())
        };
        const newSale: Sales = {
            id: salesItems.id,
            client: salesItems.client, // Matches `SelectedClient` type
            subtotal: salesItems.subtotal,
            tax: salesItems.tax,
            total: salesItems.total,
            payment: Number(salesItems.payment) ?? 0, // Default to 0 if no payment
            status: salesItems.status,
            balance: salesItems.balance,
            date: salesItems.date
        };

        dispatch(addOrUpdateSale(newSale));
        dispatch(addOrUpdateSalesItem(salesItems.services))

        // Update the saveSales state with the new sale

        showSuccess();
        setHidden(false);
        setActiveCategory(null);
        setPaymentSelected(null);
        setPayment(null);
        setFade(false);
        setSales(null);
        setSelectedClient(null);
        setCartItems([])
    };

    const handleCategoryClick = (id: number) => {
        setFade(true); // Start fade out
        const selectedServices = (valueService as { [key: string]: Service[] })[id.toString()] || [];
        setServicesData(selectedServices);
        setTimeout(() => {
            setHidden(true);
            setActiveCategory(id); // Set the clicked category as active after fade-out transition
            setFade(false); // Start fade in
        }, 300); // Delay for fade-out effect (matches the CSS transition duration)
    };

    const handlePaymentClick = () => {
        setFade(true); // Start fade out
        setTimeout(() => {
            setHidden(true);
            setActiveCategory(null);
            setPayment(1); // Set the clicked category as active after fade-out transition
            setFade(false); // Start fade in
        }, 300); // Delay for fade-out effect (matches the CSS transition duration)
    };
    const handleServiceClick = (service: Service) => {
        const guid = generateGUID();
        const newCartItem: SalesItems = {
            id: service.id, // Service id
            guid: guid,
            serviceId: service.id, // Assuming the same id for service and serviceId
            salesId: 0, // Adjust based on your sales logic
            name: service.name,
            cost: service.cost || 0,
            category: service.category || "", // Service category
            description: service.description || "", // Service description
            isDone: false, // Set the default value for isDone if needed
            appointmentColor: service.aftercareDescription || "", // You can adjust this based on your data
        };

        setCartItems((prevItems) => [...prevItems, newCartItem]);
    };
    const handlePackageClick = (pkg: Package) => {
        const guid = generateGUID();
        const newCartItem: SalesItems = {
            id: pkg.id, // Package id
            guid:guid,
            serviceId: pkg.id, // Assuming the same id for package and serviceId
            salesId: 0, // Adjust based on your sales logic
            name: pkg.name,
            cost: pkg.price || 0, // Use the price of the package
            category: pkg.category || "", // Package category
            description: pkg.description || "", // Package description
            isDone: false, // Set the default value for isDone if needed
            appointmentColor: pkg.aftercareDescription || "", // You can adjust this based on your data
        };

        setCartItems((prevItems) => [...prevItems, newCartItem]);
    };
    const handleGoBack = () => {
        setFade(true); // Start fade out
        setTimeout(() => {
            setHidden(false);
            setActiveCategory(null); // Reset active category after fade-out transition
            setPaymentSelected(null);
            setPayment(null); // Reset active category after fade-out transition
            setFade(false); // Start fade in
        }, 300); // Delay for fade-out effect
    };
    // Toggle `display: none` when fading out

    const handleClick = () => {
        setCategoryData(categories);
        setSales(true);
    };

    const sortOptions = ['Created at (Newest first)', 'Created at (Oldest first)'];

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const handleClientClick = (sales : Sales) => {
        setSelectedSales(sales);
        setSalesViewerModalOpen(true);
    };

    const closeModal = () => {
        setSales(null);
    };


    const handleCartNavClick = (index: number) => {
        setActiveIndex(index);
    };


    let  displayedSales = Object.values(valueSales).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .slice(currentPage * clientsPerPage, (currentPage + 1) * clientsPerPage);

    const handleOptionSelect = (option:  string | number | boolean) => {
        setSelectedOption(option);
    };

    const updateSalesRecord = (updatedSales: Sales) => {

        dispatch(addOrUpdateSale(updatedSales));

    };

    const handleDeleteService = (id: string) => {
        setCartItems((prevServices) => prevServices.filter(service => service.guid !== id));
    };
    const generateGUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };
    return (
        <div id={styles.sub_container} className="flex flex-col lg:flex-row">
            <NotificationModal
                isOpen={notificationModalOpen}
                onClose={() => setNotificationModalOpen(false)}
                message={message}
                isSuccess={isSuccess}
            />
            {selectedSales && (
                <ClientSalesViewerModal
                    isOpen={salesViewerModalOpen}
                    onClose={() => setSalesViewerModalOpen(false)}
                    salesDetails={selectedSales}
                    onSave={updateSalesRecord}
                />
            )}
            <div className="lg:hidden p-4 flex justify-between items-center">
                <button className="text-2xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <FaBars />
                </button>
                <span className="text-xl">Sales</span>
            </div>
            <div className={`lg:flex-none lg:p-4 border-r border-r-gray-300 lg:w-1/8 lg:block ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div className={`${isSidebarOpen ? styles.pageLabel + ' hidden' : styles.pageLabel + ' hidden lg:block'}`}>
                    <TextView text="Sales" />
                </div>
                <ClientSidebar items={sidebarItems}  onItemClick={handleItemClick} activeItem={activeItem} />

            </div>

            <div className="flex-1 p-4">
                <div id="clientHeading" className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center">
                            <div className={`${styles.pageContentHeading} mr-3`}>
                                <TextView text="Sales" />
                            </div>
                            <div className="flex items-center">
                                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-black border border-black bg-transparent rounded-full">
                                    {salesData.length}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className={styles.pageSubText}>
                                <TextView text="Manage your sales here" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <Button onClick={handleClick}><FaPlus className="mr-2" />Add</Button>
                    </div>
                </div>
                <div className={`mt-2p flex items-center justify-between ${styles.clientListSearchSection}`}>
                    <div className="w-1/3">
                        <InputText placeholder="Search by name, email or mobile number" value={salesSearch ?? ''} onChange={(e) => setSalesSearch(e.target.value)} name="clientSearch" />
                    </div>
                    <div>
                        <DropdownButton options={sortOptions} onSelect={handleOptionSelect} defaultSelected={sortOptions[0]} />
                    </div>
                </div>
                <div className="mt-2p">
                    <div className="mt-2p flex items-center justify-start border-b border-b-gray-300">
                        <div className="p-2 w-1/4 text-center ">
                            <TextView text="Sale #" />
                        </div>
                        <div className="p-2  w-1/4 text-center ">
                            <TextView text="Client" />
                        </div>
                        <div className="p-2 w-1/4 text-center">
                            <TextView text="Status" />
                        </div>
                        <div className="p-2 w-1/4 text-center ">
                            <TextView text="Sale Date" />
                        </div>
                        <div className="p-2 w-1/4 text-center ">
                            <TextView text="Tips" />
                        </div>
                        <div className="p-2 w-1/4 text-center ">
                            <TextView text="Gross Total" />
                        </div>
                    </div>
                    <div id="clientListContent">
                        {Object.values(displayedSales)
                            .map((sales, index) => (
                                <div key={index} onClick={() => handleClientClick(sales)}
                                     className="mt-2p flex items-center justify-start border-b pb-2 border-b-gray-300 cursor-pointer">
                                    <div
                                        className="p-2 w-2/12 flex-shrink-0 text-center ${styles.clientListingContentHeading}">
                                        <TextView text={sales.id.toString()}/>
                                    </div>
                                    <div
                                        className="p-2 w-2/12 flex-shrink-0 text-center ${styles.clientListingContentHeading}">
                                        <TextView text={sales.client.clientName}/>
                                    </div>
                                    <div
                                        className="p-2 w-2/12 flex-shrink-0 text-center ${styles.clientListingContentHeading}">
                                        <TextView
                                            text={sales.status}
                                            className={`rounded rounded-2xl pl-5 pr-5 w-10p font-bold capitalize 
                                            ${sales.status === 'unpaid' ? 'bg-gray-200 text-gray-600' : 'bg-green-200 text-green-600'}`}
                                        />
                                    </div>
                                    <div className={`p-2 w-2/12 text-center ${styles.clientListingContentHeading}`}>
                                        <TextView text={sales.date}/>
                                    </div>
                                    <div className={`p-2 w-2/12 text-center ${styles.clientListingContentHeading}`}>
                                        <TextView text={'0'}/>
                                    </div>
                                    <div className={`p-2 w-2/12 text-center ${styles.clientListingContentHeading}`}>
                                        <TextView text={sales.total != null ? sales.total.toFixed(2).toString() : "0.00"} />

                                    </div>
                                </div>
                            ))}


                    </div>
                </div>
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={Math.ceil(Object.values(valueSales).length / clientsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                />


                { addSales && (
                    <div className={`fixed top-0 right-0 h-full w-full lg:w-70p bg-white shadow-lg transform transition-transform translate-x-0`}>
                        <button onClick={closeModal} className="absolute top-4 right-4 text-xl">&times;</button>
                        <div className="p-4 flex h-full">
                            {!hidden && (
                                <div
                                    id="formData"
                                    className={`m-4 flex flex-col w-3/4 transition-opacity duration-300 ease-in-out ${
                                        fade ? 'opacity-0' : 'opacity-100'
                                    }`}
                                >
                                    <div className={`text-2xl`}>Add to Cart</div>

                                    {/* Search Input */}
                                    <div className="mt-5p">
                                        <InputText
                                            type="text"
                                            placeholder="Search"
                                            value={salesSearch ?? ''}
                                            onChange={(e) => setSalesSearch(e.target.value)}
                                        />
                                    </div>

                                    {/* Cart Navigation */}
                                    <div className="mt-2p mb-2p">
                                        <ul className="flex space-x-4">
                                            {cartNav.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className={`pl-2 pr-2 pt-1 pb-1 rounded-2xl ${
                                                        activeIndex === index ? 'bg-green-600 text-white' : ''
                                                    } hover:underline cursor-pointer`}
                                                >
                                                    <a
                                                        href="#"
                                                        onClick={() => handleCartNavClick(index)}
                                                        className="block"
                                                    >
                                                        {item}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Category List */}
                                    {activeIndex === 0 && (
                                        <div className={` h-full w-full rounded`}>
                                            {categoryData?.map((category) => (
                                                <div
                                                    key={category.id}
                                                    className={`m-2 pl-4 flex items-center border p-2p border-l-4 rounded`}
                                                    style={{borderLeftColor: category.appointmentColor}}
                                                    onClick={() => handleCategoryClick(Number(category.id))}
                                                >
                                                    <div className={`w-full`}>
                                                        <TextView text={category.name}/>
                                                    </div>
                                                    <div className={`flex-auto`}>
                                                        <FaChevronRight/>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {activeIndex === 1 && packages && Object.keys(packages).length > 0 && Object.keys(packages).map((id) => {
                                            const packaging = packages[parseInt(id)]; // Access the package by id
                                            if (!packaging) {
                                                return null; // or handle the undefined case
                                            }
                                            return (
                                                <div key={id} >
                                                    {/* Render the package data, assuming 's' is an array of packages */}
                                                    {packaging.map((service) => {
                                                        const guid = generateGUID();
                                                         return (
                                                             <div key={guid}
                                                                      className={`border mt-2 mb-2 p-2p rounded-md`}
                                                                      style={{
                                                                          borderLeftWidth: '8px',
                                                                          borderLeftColor: 'rgb(223 198 198)'
                                                                      }}
                                                             onClick={()=>{handlePackageClick(service)}}
                                                             >
                                                                     <div className={`flex flex-row`}>
                                                                         <div className={`w-1/2`}>
                                                                             {service.name} - {service.description}
                                                                         </div>
                                                                         <div className="w-1/2 ml-auto">
                                                                             <div className="flex justify-end items-center">
                                                                                 <div className="mr-2">
                                                                                     PHP {service.price}
                                                                                 </div>

                                                                             </div>
                                                                         </div>
                                                                     </div>
                                                             </div>
                                                         )
                                                    })}
                                                </div>
                                            );
                                        }
                                    )}

                                    {activeIndex === 2 && products && Object.keys(products).length > 0 && Object.keys(products).map((id) => {
                                        const packaging = products[parseInt(id)]; // Access the package by id
                                        if (!packaging) {
                                            return null; // or handle the undefined case
                                        }
                                        return (
                                            <div key={id}>
                                                {/* Render the package data, assuming 's' is an array of packages */}
                                                {packaging.map((service) => (
                                                    <div key={service.id} className={`border mt-2 mb-2 p-2p rounded-md`}
                                                         style={{
                                                             borderLeftWidth: '8px',
                                                             borderLeftColor: 'rgb(223 198 198)'}}>
                                                            <div className={`flex flex-row`}>
                                                                <div className={`w-1/2`}>
                                                                    {service.name} - {service.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                            {activeCategory !== null && (
                                <div className={`m-4 flex flex-col w-3/4`}>
                                    {/* Services Header */}
                                    <div className={`mb-4`}>
                                        <h2 className="text-2xl">
                                            {categoryData?.find((cat) => cat.id === activeCategory)?.name}
                                        </h2>
                                        <div className={`text-xs text-gray-400`}>
                                            <TextView text={"Click items to add to cart"}/>
                                        </div>
                                    </div>

                                    {/* Services List */}
                                    {servicesData?.map((selectedServices) => {
                                        const guid = generateGUID();
                                        return (
                                            <div
                                                key={guid}
                                                className={`m-2 pl-4 flex items-center border p-2p border-l-4 rounded`}
                                                style={{
                                                    borderLeftColor: categoryData?.find(
                                                        (cat) => cat.id === Number(selectedServices.category)
                                                    )?.appointmentColor,
                                                }}
                                                onClick={() => handleServiceClick(selectedServices)} // Add service to cart on click
                                            >
                                                <div className={`w-full`}>
                                                    {selectedServices.name + " - " + selectedServices.description}
                                                </div>
                                                <div className={`w-1/4 text-right flex-auto`}>
                                                    &#8369; {selectedServices.cost}
                                                </div>
                                            </div>
                                        )
                                    })}

                                    <button
                                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                                        onClick={handleGoBack}
                                    >
                                        Go Back
                                    </button>
                                </div>
                            )}

                            {activePayment !== null && (
                                <div className={`m-4 flex flex-col w-3/4`}>
                                    {/* Services Header */}
                                    <div className={`mb-4`}>
                                        <h2 className="text-2xl">
                                            Payment Selection
                                        </h2>
                                    </div>
                                    <div className={`flex`}>
                                        <div className={`flex flex-col p-2`}>
                                            <div
                                                className={` border border-gray-300 border-4 hover:border-green-600 rounded cursor-pointer`}
                                                 onClick={() => setPaymentSelected('CASH')}
                                            >
                                                <FaMoneyBill size={`40px`} style={{ marginBottom:'0',marginTop:'20px',marginLeft:'20px',marginRight:'20px', color: 'rgb(34 197 94)' }} />
                                                <div className={`text-center`}><TextView text={"Cash"}/></div>
                                            </div>
                                        </div>
                                        <div className={`flex flex-col p-2`}>
                                            <div
                                                className={` border border-gray-300 border-4 hover:border-green-600 rounded cursor-pointer`}
                                                onClick={() => setPaymentSelected('OTHERS')}
                                            >
                                                <FaCoins size={`40px`} style={{
                                                    marginBottom: '0',
                                                    marginTop: '20px',
                                                    marginLeft: '20px',
                                                    marginRight: '20px',
                                                    color: 'rgb(34 197 94)'
                                                }}/>
                                                <div className={`text-center`}><TextView text={"Others"}/></div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                                        onClick={handleGoBack}
                                    >
                                        Go Back
                                    </Button>
                                </div>
                            )}

                            <div className={`m-2p w-1/2 flex-col border-l border-l-gray-300 h-auto`}>
                                {/* Conditional rendering based on whether Add Client button was clicked */}
                                {isClientView ? (
                                    // Empty Div (after clicking Add Client)
                                    <div className="flex flex-col justify-center items-center h-full m-2p">
                                        <div className="mt-5p w-full mb-2p">
                                            <InputText
                                                type="text"
                                                placeholder="Search"
                                                value={salesSearch ?? ''}
                                                onChange={(e) => setSalesSearch(e.target.value)}
                                            />
                                        </div>
                                        <div
                                            className="flex flex-col text-gray-500  mb-4 overflow-x-auto max-h-full w-full">
                                            {clientList.map((client) => (
                                                <div key={client.id}
                                                    className={`m-2p border border-gray-300 border-4 hover:border-green-600 rounded p-5p cursor-pointer`}
                                                     onClick={() => handleSelectClientClick(client)}
                                                >
                                                    {client.firstName + " " + client.lastName}
                                                </div>
                                            ))}
                                        </div>
                                        <Button onClick={handleGoBackClick} className="bg-gray-300 p-2 rounded">
                                            Go Back
                                        </Button>
                                    </div>
                                ) : (
                                    // Cart View
                                    <>
                                        <div className={`flex m-10p`}>
                                            <div
                                                id={`addClientBtn`}
                                                onClick={handleAddClientClick}
                                                className={`flex flex-row w-full border border-gray-300 border-4 hover:border-green-600 rounded p-5p cursor-pointer`}
                                            >
                                                <div className={`w-auto`}>
                                                    <div className={``}>
                                                        {selectedClient && selectedClient.length > 0
                                                            ? `${selectedClient[0].clientName}`
                                                            : "Add Client"
                                                        }
                                                    </div>
                                                    <div className={`text-xs text-gray-400`}>
                                                        {selectedClient && selectedClient.length > 0
                                                            ? `${selectedClient[0].email}`
                                                            : "Leave empty for walk-ins"
                                                        }
                                                    </div>
                                                </div>
                                                <div className={`flex-auto text-right`}>
                                                    <Avatar name={ selectedClient && selectedClient.length > 0
                                                        ? `${selectedClient[0].clientName}` // Display selected client's name
                                                        : ""  // Default text
                                                    } size="35px"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div id={`addedToCart`}
                                             className={`flex flex-col mt-10p overflow-x-auto max-h-96`}>
                                            {cartItems.map((service, index) => (
                                                <div
                                                    key={`${service.id}-${index}`} // Ensure a unique key by combining id and index
                                                    className={`flex m-2 p-2 border border-l-4 rounded`}
                                                    style={{
                                                        borderLeftColor: categoryData?.find(
                                                            (cat) => cat.id === Number(service.category)
                                                        )?.appointmentColor,
                                                    }}
                                                >
                                                    <div className={`w-full flex flex-col`}>
                                                        <div className={`font-semibold`}>{service.name}</div>
                                                        <div className={`text-sm text-gray-500`}>
                                                            {service.description}
                                                        </div>
                                                        {!service.category
                                                            ? getPackageById(service.serviceId.toString()).map((pkg) => (
                                                                <ul key={pkg.id}>
                                                                    {pkg.services.map((selected) => (
                                                                        <li key={selected.id}>{selected.name}</li>
                                                                    ))}
                                                                </ul>
                                                            ))
                                                            : ''}
                                                    </div>
                                                    <div className={`w-1/4 flex-auto items-baseline text-right`}>
                                                        <div>&#8369; {service.cost}</div>
                                                        <div className={`float-right`}><FaTrash
                                                            className="trash-icon"
                                                            onClick={() => handleDeleteService(service?.guid || '')}
                                                        /></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={`flex justify-start p-4 mt-4 border-b`}>
                                            <div className={`w-full flex flex-col items-start`}>
                                                {/* Subtotal */}
                                                <div className={`mb-2`}>
                                                    Subtotal: &#8369; {cartItems.reduce((acc, service) => Number(acc) + Number(service.cost), 0).toLocaleString()}
                                                </div>

                                                {/* Tax (Assuming 12% VAT) */}
                                                <div className={`mb-2`}>
                                                    Tax
                                                    (12%): &#8369; {(cartItems.reduce((acc, service) => Number(acc) + Number(service.cost), 0) * 0.12).toLocaleString()}
                                                </div>

                                                {/* Total (Subtotal + Tax) */}
                                                <div className={`font-bold`}>
                                                    Total: &#8369; {(cartItems.reduce((acc, service) => Number(acc) + Number(service.cost), 0) * 1.12).toLocaleString()}
                                                </div>
                                                {paymentSelected ? (
                                                    <div className={`flex font-bold`}>
                                                        <div className={`flex items-center`}>
                                                            <TextView text={ paymentSelected + ":" } />
                                                        </div>
                                                        <div className={`ml-2p`}>
                                                            <InputText
                                                                type="text"
                                                                value={encodedCash ?? '0'}
                                                                onChange={(e) => setEncodedCash(e.target.value)}
                                                            />
                                                        </div>

                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}
                                            </div>
                                        </div>

                                        <div className={`flex items-center mt-2p`}>
                                            <div className={`flex-auto p-2p border rounded m-2p`}>
                                                <Popover
                                                    trigger={<FaEllipsisV/>}
                                                    content={
                                                        <div>
                                                            <div onClick={handleSetSalesItems} style={{ cursor: 'pointer' }}>Save
                                                                Unpaid
                                                            </div>
                                                            <div>Cancel Sale</div>
                                                        </div>
                                                    }
                                                    position={`top`}
                                                />
                                            </div>
                                            <div className={`w-full`}>
                                                { activePayment && paymentSelected ? (
                                                    <Button disabled={encodedCash || Number(encodedCash) !== 0 ? false:true } onClick={handleSetSalesItems}>Payment Now</Button>)
                                                    : (
                                                        <Button onClick={handlePaymentClick}>Continue to Payment</Button>
                                                    )
                                                }
                                            </div>

                                        </div>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SalesPage;
