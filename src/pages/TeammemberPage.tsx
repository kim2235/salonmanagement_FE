import React, { useState } from 'react';

import {FaBars, FaCalendar, FaEllipsisV, FaPlus} from "react-icons/fa";
import TextView from "../components/TextViewComponent/TextView";
import ClientSidebar from "../components/Sidebars/ClientSidebarComponent/ClientSidebar";
import styles from "./styles/ClientStyle.module.css";
import Button from "../components/ButtonComponent/Button";
import InputText from "../components/InputTextComponent/InputText";
import AddTeamMemberModalComponent from "../components/AddTeamModalComponent/AddTeamMemberModal";
import Avatar from "../components/AvatarComponent/Avatar";
import Popover from "../components/PopoverModalComponent/Popover";
import AddTeamMemberModal from "../components/AddTeamModalComponent/AddTeamMemberModal";
import {sidebarItems} from "./menuitems/sidebarItems";
import {useNavigate} from "react-router-dom";
const TeamMemberPage: React.FC = () => {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<any[]>([]);
    const [activeItemId, setActiveItemId] = useState<string | null>('clientDetail');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [teamSearch, setTeamSearch] = useState<any>(null);
    const [activeItem, setActiveItem] = useState<string | null>('team');

    const handleItemClick = (id: string, type: 'link' | 'div') => {
        setActiveItem(id);

        if (type === 'link') {
            const item = sidebarItems.find((item) => item.id === id);
            if (item?.href) {
                navigate(item.href); // Use the `href` value for navigation
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleAddTeamMember = (newMember: any) => {
        setTeamMembers((prevMembers) => [...prevMembers, newMember]);
    };

    return (
        <div className={`flex flex-col lg:flex-row h-screen`}>
            <div className="lg:hidden p-4 flex justify-between items-center">
                <button className="text-2xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <FaBars/>
                </button>
                <span className="text-xl">Team</span>
            </div>
            <div
                className={`lg:flex-none lg:p-4 border-r border-r-gray-300 lg:w-1/8 lg:block ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div
                    className={`${isSidebarOpen ? styles.pageLabel + ' hidden' : styles.pageLabel + ' hidden lg:block'}`}>
                    <TextView text="Menu"/>
                </div>
                <ClientSidebar items={sidebarItems} onItemClick={handleItemClick} activeItem={activeItem} />
            </div>

            <div className="flex-1 p-4">
                <div id="clientHeading" className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center">
                            <div className={`${styles.pageContentHeading} mr-3`}>
                                <TextView text="Team"/>
                            </div>

                        </div>
                        <div>
                            <div className={styles.pageSubText}>
                                <TextView text="View and manage your awesome team here"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-1/2 items-center justify-end">
                        <div className={`mr-2`}><Button onClick={() => (setIsModalOpen(true))}><FaPlus className="mr-2"/>Add New Team member</Button></div>
                        <div className={`ml-2`}><Button onClick={() => (setIsModalOpen(true))}><FaCalendar />Scheduled Shifts</Button></div>
                    </div>
                </div>
                <div className={`w-full mt-2p flex items-center justify-between ${styles.clientListSearchSection}`}>
                    <div className="w-1/2">
                        <InputText placeholder="Search by name, email or mobile number" value={teamSearch ?? ''}
                                   onChange={(e) => setTeamSearch(e.target.value)} name="clientSearch"/>
                    </div>
                </div>
                <div className="mt-2p">
                    <div className="mt-2p flex items-center justify-start border-b border-b-gray-300">
                        <div className="p-2 w-1/4 text-center ${styles.clientListingContentHeading}">
                            <TextView text="Name" />
                        </div>
                        <div className="p-2  w-1/4 text-center ${styles.clientListingContentHeading}">
                            <TextView text="Contact " />
                        </div>
                        <div className="p-2 w-1/4 text-center ${styles.clientListingContentHeading}">
                            <TextView text="Rating" />
                        </div>
                        <div className="p-2 w-1/4 text-center ${styles.clientListingContentHeading}">
                            <TextView text="Actions" />
                        </div>
                    </div>
                    <div id="clientListContent">
                        <div className={`flex m-2p`}>
                            <div className="p-2 w-1/4 flex-shrink-0 flex justify-start">
                                <div>
                                    <Avatar name={`John Doe`} size="75px"/>
                                </div>
                                <div className="ml-10p mt-2p">
                                    <div className="flex justify-center items-center h-full w-full">
                                        <TextView className="text-center text-lg font-bold" text="John Doe"/>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2 w-1/4 flex-shrink-0 flex justify-center">
                                <div className="ml-10p mt-2p">
                                    <div className=" items-center">
                                        <TextView className="text-center text-lg " text="john@example.com"/>
                                    </div>
                                    <div className=" items-center">
                                        <TextView className="text-center text-lg " text="099999999"/>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2 w-1/4 flex-shrink-0 flex justify-center">
                                <div className="ml-10p mt-2p">
                                    <div className=" items-center">
                                        <TextView className="text-center text-lg " text="-"/>
                                    </div>
                                </div>
                            </div>
                            <div className={`flex justify-center items-center h-full w-full`}>
                                <div className={`mt-2p`}>
                                    <Popover
                                        trigger={<FaEllipsisV/>}
                                        content={<div>
                                            <div
                                                onClick={() => console.log('test')}
                                                style={{
                                                    padding: '8px',
                                                    cursor: 'pointer'
                                                }}>Edit
                                            </div>
                                            <div
                                                onClick={() => console.log('test')}
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
            </div>
            {isModalOpen && (
                <AddTeamMemberModal
                    onClose={handleCloseModal}
                    onAddTeamMember={handleAddTeamMember}
                />
            )}
        </div>

    );
};

export default TeamMemberPage;
