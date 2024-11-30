import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {RootState} from "../redux/store";
import {Client} from "../types/Client";
import TextView from "../components/TextViewComponent/TextView";
import Button from "../components/ButtonComponent/Button";
import ClientSidebar from "../components/Sidebars/ClientSidebarComponent/ClientSidebar";
import styles from './styles/ClientStyle.module.css';
import InputText from "../components/InputTextComponent/InputText";
import DropdownButton from "../components/DropdownButtonComponent/DropdownButton";
import Checkbox from "../components/CheckBoxComponent/Checkbox";
import Avatar from "../components/AvatarComponent/Avatar";
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FaPlus, FaBars } from 'react-icons/fa';
import ClientProfile from "../components/SubClientComponent/ClientProfile";
import ClientDocument from "../components/SubClientDocumentComponent/ClientDocument";
import ClientNote from "../components/subClientNoteComponent/ClientNote";

import {sidebarItems} from "./menuitems/sidebarItems";
import {SidebarItem} from "./menuitems/sidebarItems";


const clientsDocs = [
    { id: '11111111', name: "John Doe Waiver", created_at: "2024-01-01", pdfUrl: "/temp/sample.pdf" },
    { id: '11111112', name: "Jane Smith SPA", created_at: "2024-01-01", pdfUrl: "/temp/sample2.pdf" },
    { id: '11111111', name: "John Doe Insurance", created_at: "2024-01-01", pdfUrl: "/temp/sample.pdf" }
];
const clientsNotes = [
    { id: '11111111', name: "JTest note", created_at: "2024-01-01", note: "/temp/sample.pdf" },
    { id: '11111112', name: "Last check notes", created_at: "2024-01-01", note: "/temp/sample2.pdf" },
    { id: '11111111', name: "John Doe Insurance number", created_at: "2024-01-01", note: "/temp/sample.pdf" }
];



const ClientListPage: React.FC = () => {
    const navigate = useNavigate();
    const clients = useSelector((state: RootState) => state.clients.valueClients);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [activeContent, setActiveContent] = useState<React.ReactNode>(<ClientProfile />);
    const [selectedOption, setSelectedOption] = useState< string | number | boolean | null>(null);
    const [activeItemId, setActiveItemId] = useState<string | null>('clientDetail'); // State to track active item
    const clientsPerPage = 4;
    const [activeItem, setActiveItem] = useState<string | null>('clientlist');
    const handleItemClick = (id: string, type: 'link' | 'div') => {
        setActiveItem(id);

        if (type === 'link') {
            const item = sidebarItems.find((item) => item.id === id);
            if (item?.href) {
                navigate(item.href); // Use the `href` value for navigation
            }
        }
    };
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    const handleClick = () => {
        navigate('/add-new-client');
    };

    const sortOptions = ['Created at (Newest first)', 'Created at (Oldest first)'];

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const handleClientClick = (client: any) => {
        setSelectedClient(client);
        setActiveItemId(client.id);

        setActiveContent(
            <ClientProfile
                clientData={client}
                onClientUpdate={handleClientUpdate}
            />
        );
    };
    const handleClientUpdate = (updatedClientData: any) => {
        console.log("Updated client data:", updatedClientData);
        // Perform any update logic such as sending data to the server or updating state
    };
    const closeModal = () => {
        setSelectedClient(null);
    };


    const modalSidebarItems: SidebarItem[] = [
        { label: 'Client Details', type: 'div', id: 'clientDetail' },
        { label: 'Documents',type: 'div', id: 'documents'  },
        { label: 'Notes',type: 'div', id: 'notes'  },
        { label: 'Sales',type: 'div', id: 'sales' },
    ];
    const handleSubItemClick =  (id: string, type: 'link' | 'div') => {
        setActiveItemId(id);

        if (type === 'div') {
            switch (id) {
                case 'clientDetail':
                    setActiveContent(<ClientProfile clientData={selectedClient} />);
                    break;
                case 'documents':
                    setActiveContent(<ClientDocument clientsDocs={clientsDocs} />);
                    break;
                default:
                    setActiveContent(<ClientNote clientsNotes={clientsNotes} />);
                    break;
            }
        }
    };
    const sidebarItemsWithActive = modalSidebarItems.map((item) => ({
        ...item,
        active: item.id === activeItemId, // Mark as active if id matches the activeItemId
    }));

    const displayedClients = Object.values(clients).slice(currentPage * clientsPerPage, (currentPage + 1) * clientsPerPage);

    const handleOptionSelect = (option:  string | number | boolean) => {
        setSelectedOption(option);
    };
    return (
        <div id={styles.sub_container} className="flex flex-col lg:flex-row">
            <div className="lg:hidden p-4 flex justify-between items-center">
                <button className="text-2xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <FaBars />
                </button>
                <span className="text-xl">Clients</span>
            </div>
            <div className={`lg:flex-none lg:p-4 border-r border-r-gray-300 lg:w-1/8 lg:block ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div className={`${isSidebarOpen ? styles.pageLabel + ' hidden' : styles.pageLabel + ' hidden lg:block'}`}>
                    <TextView text="Clients" />
                </div>
                <ClientSidebar items={sidebarItems}  onItemClick={handleItemClick} activeItem={activeItem} />

            </div>

            <div className="flex-1 p-4">
                <div id="clientHeading" className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center">
                            <div className={`${styles.pageContentHeading} mr-3`}>
                                <TextView text="Client List" />
                            </div>
                            <div className="flex items-center">
                                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-black border border-black bg-transparent rounded-full">
                                    {Object.values(clients).length}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className={styles.pageSubText}>
                                <TextView text="View, add, edit and delete your client's details." />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <Button onClick={handleClick}><FaPlus className="mr-2" />Add Client</Button>
                    </div>
                </div>
                <div className={`mt-2p flex items-center justify-between ${styles.clientListSearchSection}`}>
                    <div className="w-1/3">
                        <InputText placeholder="Search by name, email or mobile number" name="clientSearch" />
                    </div>
                    <div>
                        <DropdownButton options={sortOptions} onSelect={handleOptionSelect} defaultSelected={sortOptions[0]} />
                    </div>
                </div>
                <div className="mt-2p">
                    <div className="mt-2p flex items-center justify-start border-b border-b-gray-300">
                        <div className="p-2 w-12 flex-shrink-0 pl-4">
                            <Checkbox id="selectAllClient" checked={isChecked} onChange={handleCheckboxChange} value="testValue" size="20px" />
                        </div>
                        <div className={`p-2 w-1/4 flex-shrink-0 ${styles.clientListingContentHeading}`}>
                            <TextView text="Client Name" />
                        </div>
                        <div className={`p-2 w-2/12 flex-shrink-0 text-center ${styles.clientListingContentHeading}`}>
                            <TextView text="Mobile Number" />
                        </div>
                        <div className={`p-2 w-2/12 text-center ${styles.clientListingContentHeading}`}>
                            <TextView text="Reviews" />
                        </div>
                        <div className={`p-2 w-2/12 text-center ${styles.clientListingContentHeading}`}>
                            <TextView text="Sales" />
                        </div>
                        <div className={`p-2 w-2/12 text-center ${styles.clientListingContentHeading}`}>
                            <TextView text="Created At" />
                        </div>
                    </div>
                    <div id="clientListContent">
                        {Object.values(displayedClients).map((client, index) => (
                            <div key={index} onClick={() => handleClientClick(client)} className="mt-2p flex items-center justify-start border-b pb-2 border-b-gray-300 cursor-pointer">
                                <div className="p-2 w-12 flex-shrink-0 pl-4">
                                    <Checkbox id={`selectClient-${index}`} checked={isChecked} onChange={handleCheckboxChange} value="testValue" size="20px" />
                                </div>
                                <div className="p-2 w-1/4 flex-shrink-0 flex justify-start">
                                    <div>
                                        <Avatar name={client.firstName} size="75px" />
                                    </div>
                                    <div className="ml-10p mt-2p">
                                        <div className={styles.clientContentName}>
                                            <TextView text={client.lastName} />
                                        </div>
                                        <div className={styles.clientContentEmail}>
                                            <TextView text={client.email} />
                                        </div>

                                    </div>
                                </div>
                                <div className="p-2 w-2/12 flex-shrink-0 text-center ${styles.clientListingContentHeading}">
                                    <TextView text={client.contactNumber} />
                                </div>
                                <div className="p-2 w-2/12 text-center ${styles.clientListingContentHeading}">
                                    <TextView text="-" />
                                </div>
                                <div className="p-2 w-2/12 text-center ${styles.clientListingContentHeading}">
                                    <TextView text="-" />
                                </div>
                                <div className="p-2 w-2/12 text-center ${styles.clientListingContentHeading}">
                                    <TextView text="-" />
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
                    pageCount={Math.ceil(Object.values(clients).length/ clientsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                />
                {selectedClient && (
                    <div className={`fixed top-0 right-0 h-full w-full lg:w-70p bg-white shadow-lg transform transition-transform translate-x-0`}>
                        <button onClick={closeModal} className="absolute top-4 right-4 text-xl">&times;</button>
                        <div className="p-4 flex h-full">
                            <div className={`m-2p flex-col border-r border-r-gray-300 h-auto`}>
                                <div>
                                    <div className={`text-center`}>
                                        <Avatar name={'John Doe'} size="155px"/>
                                        <div className={`mt-2 ${styles.clientContentName}`}>
                                            <TextView text={selectedClient.firstName + ' ' + selectedClient.lastName}/>
                                        </div>
                                    </div>
                                    <div className="m-4 flex w-1/6 space-x-4">
                                        <div className="flex-1">
                                            <Button size="extraSmall">Sell</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`m-4 flex`}>
                                <ClientSidebar items={sidebarItemsWithActive } onItemClick={handleSubItemClick} activeItem={activeItemId} />
                            </div>
                            <div className={`m-4 flex w-full`}>
                                {activeContent}
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ClientListPage;
