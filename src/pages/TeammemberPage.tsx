import React, { useState } from 'react';

import {FaBars, FaPlus} from "react-icons/fa";
import TextView from "../components/TextViewComponent/TextView";
import ClientSidebar from "../components/Sidebars/ClientSidebarComponent/ClientSidebar";
import eventsPlot from "../testData/eventsPlot.json";
import styles from "./styles/ClientStyle.module.css";
import Button from "../components/ButtonComponent/Button";
import InputText from "../components/InputTextComponent/InputText";
import DropdownButton from "../components/DropdownButtonComponent/DropdownButton";
interface SidebarItem {
    label: string;
    href?: string;
    type: 'link' | 'div';
    id?: string;
    active?: boolean;
}
const TeamMemberPage: React.FC = () => {
    const [reservations, setReservations] = useState<any[]>([]);
    const [activeItemId, setActiveItemId] = useState<string | null>('clientDetail');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [teamSearch, setTeamSearch] = useState<any>(null);
    const sidebarItems: SidebarItem[] = [
        { label: 'Dashboard', href: '/', type: 'link' },
        { label: 'Client List', href: '/clientlist', type: 'link' },
        { label: 'Service/Package', href: '/catalog', type: 'link'},
        { label: 'Sales', href: '/sales', type: 'link' },
        { label: 'Team', href: '/team', type: 'link', active: true  },
    ];
    const handleItemClick = (id: string, type: 'link' | 'div') => {
        setActiveItemId(id);
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
                    <TextView text="Catalog"/>
                </div>
                <ClientSidebar items={sidebarItems} onItemClick={handleItemClick}/>
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
                    <div className="flex items-center justify-between">
                        <Button onClick={() => (console.log('test'))}><FaPlus className="mr-2"/>Add</Button>
                    </div>
                </div>
                <div className={`w-full mt-2p flex items-center justify-between ${styles.clientListSearchSection}`}>
                    <div className="w-1/2">
                        <InputText placeholder="Search by name, email or mobile number" value={teamSearch ?? ''}
                                   onChange={(e) => setTeamSearch(e.target.value)} name="clientSearch"/>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default TeamMemberPage;
