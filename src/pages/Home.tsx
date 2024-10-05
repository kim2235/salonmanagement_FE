import React, { useState } from 'react';
import Scheduler from '../components/SchedulerComponent/Scheduler';
import {CalendarEvent} from "../components/SchedulerComponent/Scheduler";
import styles from "./styles/ClientStyle.module.css";
import {FaBars} from "react-icons/fa";
import TextView from "../components/TextViewComponent/TextView";
import ClientSidebar from "../components/Sidebars/ClientSidebarComponent/ClientSidebar";
import eventsPlot from "../testData/eventsPlot.json";
interface SidebarItem {
    label: string;
    href?: string;
    type: 'link' | 'div';
    id?: string;
    active?: boolean;
}
const Home: React.FC = () => {
    const [reservations, setReservations] = useState<any[]>([]);
    const [activeItemId, setActiveItemId] = useState<string | null>('clientDetail');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarItems: SidebarItem[] = [
        { label: 'Dashboard', href: '/', type: 'link', active: true  },
        { label: 'Client List', href: '/clientlist', type: 'link' },
        { label: 'Service/Package', href: '/catalog', type: 'link'},
        { label: 'Sales', href: '/sales', type: 'link' },
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
        <div id={styles.sub_container} className="flex flex-col lg:flex-row max-h-fit">
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

            <div className="flex-1 p-4 max-h-fit overflow-y-auto">
            <Scheduler onReservationSelect={handleReservationSelect} eventsPlot={eventsPlot} />
            </div>
        </div>

    );
};

export default Home;
