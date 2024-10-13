import React, { useState } from 'react';
import Scheduler from '../components/SchedulerComponent/Scheduler';
import {CalendarEvent} from "../components/SchedulerComponent/Scheduler";
import styles from "./styles/ClientStyle.module.css";
import {
    FaBars,
    FaBell,
    FaCalendarAlt,
    FaCalendarPlus,
    FaEnvelope,
    FaRegEyeSlash,
    FaTags
} from "react-icons/fa";
import TextView from "../components/TextViewComponent/TextView";
import ClientSidebar from "../components/Sidebars/ClientSidebarComponent/ClientSidebar";
import {FaBoltLightning, FaCalendarXmark, FaEnvelopesBulk, FaGears, FaTicket} from "react-icons/fa6";
interface SidebarItem {
    label: string;
    href?: string;
    type: 'link' | 'div';
    id?: string;
    active?: boolean;
}
const DealsPage: React.FC = () => {
    const [reservations, setReservations] = useState<any[]>([]);
    const [activeItemId, setActiveItemId] = useState<string | null>('clientDetail');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarItems: SidebarItem[] = [
        { label: 'Dashboard', href: '/', type: 'link'  },
        { label: 'Client List', href: '/clientlist', type: 'link' },
        { label: 'Service/Package', href: '/catalog', type: 'link'},
        { label: 'Sales', href: '/sales', type: 'link' },
        { label: 'Team', href: '/team', type: 'link' },
        { label: 'Marketing Kit', href: '/marketing', type: 'link', active: true  },
    ];
    const handleItemClick = (id: string, type: 'link' | 'div') => {
        setActiveItemId(id);
    };
    const handleReservationSelect = (event : CalendarEvent) => {
        const formattedEvent = {
            ...event,
            start: new Date(event.start).toLocaleString(),
            end: new Date(event.end).toLocaleString(),
        };
        console.log('Formatted event: ', formattedEvent);
    };


    return (
        <div id={styles.sub_container} className={`flex flex-col lg:flex-row max-h-fit`}>
            <div className={`lg:hidden p-4 flex justify-between items-center`}>
                <button className={`text-2xl`} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <FaBars />
                </button>
                <span className={`text-xl`}>Menu</span>
            </div>
            <div className={`lg:flex-none lg:p-4 border-r border-r-gray-300 lg:w-1/8 lg:block ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div className={`${isSidebarOpen ? styles.pageLabel + ' hidden' : styles.pageLabel + ' hidden lg:block'}`}>
                    <TextView text="Menu" />
                </div>
                <ClientSidebar items={sidebarItems} onItemClick={handleItemClick} />
            </div>

            <div className={`flex-1 p-4 max-h-fit overflow-y-auto`}>
                <div id="clientHeading" className={`flex items-center justify-between`}>
                    <div>
                        <div className={`flex items-center`}>
                            <div className={`${styles.pageContentHeading} mr-3`}>
                                <TextView text="Marketing"/>
                            </div>

                        </div>
                        <div>
                            <div className={styles.pageSubText}>
                                <TextView text="Checkout our out of the box toolkit that is ready to help you do more.."/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`mt-2p`}>
                    <div className={`flex flex-col`}>
                        <div className={`text-2xl font-bold`}>
                            <TextView text="Select Deal Type"/>
                        </div>
                        <div className={`text-xs text-gray-400 mb-2p`}>
                            <TextView text="Choose the type of Deal you want to make"/>
                        </div>
                        <div className={`w-full`}>
                            <div className={`border flex flex-col w-48.5p p-2 mb-2`}>
                                <div className={`text-2xl font-bold `}>
                                    <TextView text="Promotion"/>
                                </div>
                                <div className={`flex`}>
                                    <div className={`text-green-900`}>
                                        <TextView
                                            text="Create a discount redeemed by clients entering the code when booking online or during checkout at point of sale"/>
                                    </div>
                                    <div className={`text-orange-400`}>
                                        <FaTicket size={34}/>
                                    </div>
                                </div>
                            </div>

                            <div className={`border flex flex-col w-48.5p p-2 mb-2`}>
                                <div className={`text-2xl font-bold `}>
                                    <TextView text="Flash Sale"/>
                                </div>
                                <div className={`flex`}>
                                    <div className={`text-green-900`}>
                                        <TextView
                                            text="Immediately apply a discount online and let your team member manually add it to appointments and sales"/>
                                    </div>
                                    <div className={`text-yellow-300`}>
                                        <FaBoltLightning size={34}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default DealsPage;
