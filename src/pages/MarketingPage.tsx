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
import {FaCalendarXmark, FaEnvelopesBulk, FaGears} from "react-icons/fa6";
import {Link} from "react-router-dom";
interface SidebarItem {
    label: string;
    href?: string;
    type: 'link' | 'div';
    id?: string;
    active?: boolean;
}
const MarketingPage: React.FC = () => {
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
                <span className={`text-xl`}>Catalog</span>
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
                    <div className={`flex`}>
                        <div className={`h-full w-auto`}>
                            <div className={`flex flex-col w-48 mb-4`}>
                                <div className={`mb-2`}><TextView text="Messaging" className={`text-2xl`}/></div>
                                <div className="flex flex-col">
                                    <div className="flex items-center p-2 bg-green-300 rounded font-bold text-gray-700">
                                        <FaGears/>
                                        <TextView text="Automation" className="ml-2"/>
                                    </div>
                                    <div className="flex items-center p-2 w-full text-gray-700">
                                        <FaEnvelopesBulk/>
                                        <TextView text="Messaging History" className="ml-2"/>
                                    </div>
                                </div>
                            </div>
                            <div className={`flex flex-col w-48`}>
                                <div className={`mb-2`}><TextView text="Promotion" className={`text-2xl`}/></div>
                                <div className="flex flex-col">
                                    <Link to="/deals" className="flex items-center p-2 font-bold text-gray-700">
                                        <FaTags />
                                        <TextView text="Deals" className="ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className={`h-full w-full ml-2p`}>
                            {/**Reminder**/}
                            <div className={`flex flex-col`}>
                                <div className={`mb-2`}>
                                    <div className={`text-2xl`}><TextView text="Reminders" /></div>
                                </div>
                                <div className={`flex w-full`}>
                                    <div className={`m-2 border-2 w-64`}>
                                        <div className={`p-7 `}>
                                            <div><FaBell className={`text-green-900`} size={22}/></div>
                                            <div className={`font-bold`}><TextView
                                                text="24 Hours upcoming appointment reminder"/></div>
                                            <div className={`text-gray-400`}><TextView
                                                text="Notifies clients reminding of their appointment"/></div>
                                        </div>
                                        {/**Enabled or Disabled **/}
                                        <div className={`flex justify-between text-xs m-2`}>
                                            <div className={`bg-green-300 rounded p-2 font-bold`}>
                                                <TextView text="Enabled"/>
                                            </div>
                                            <div className={`text-green-300 rounded p-2`}>
                                                <FaEnvelope/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`m-2 border-2 w-64`}>
                                        <div className={`p-7 `}>
                                            <div><FaBell className={`text-green-900`} size={22}/></div>
                                            <div className={`font-bold`}><TextView
                                                text="1 Hours upcoming appointment reminder"/></div>
                                            <div className={`text-gray-400`}><TextView
                                                text="Notifies clients reminding of their appointment"/></div>
                                        </div>
                                        {/**Enabled or Disabled **/}
                                        <div className={`flex justify-between text-xs m-2`}>
                                            <div className={`bg-green-300 rounded p-2 font-bold`}>
                                                <TextView text="Enabled"/>
                                            </div>
                                            <div className={`text-green-300 rounded p-2`}>
                                                <FaEnvelope/>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            {/**Appointment**/}
                            <div className={`flex flex-col`}>
                                <div className={`mb-2`}>
                                    <div className={`text-2xl`}><TextView text="Appointments" /></div>
                                </div>
                                <div className={`flex w-full`}>
                                    <div className={`m-2 border-2 w-64`}>
                                        <div className={`p-7 `}>
                                            <div><FaCalendarPlus className={`text-green-900`} size={22}/></div>
                                            <div className={`font-bold`}><TextView
                                                text="New Appointment"/></div>
                                            <div className={`text-gray-400`}><TextView
                                                text="Reach out to client if their appoinment has been booked"/></div>
                                        </div>
                                        {/**Enabled or Disabled **/}
                                        <div className={`flex justify-between text-xs m-2`}>
                                            <div className={`bg-green-300 rounded p-2 font-bold`}>
                                                <TextView text="Enabled"/>
                                            </div>
                                            <div className={`text-green-300 rounded p-2`}>
                                                <FaEnvelope/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`m-2 border-2 w-64`}>
                                        <div className={`p-7 `}>
                                            <div><FaCalendarAlt className={`text-green-900`} size={22}/></div>
                                            <div className={`font-bold`}><TextView
                                                text="Reschedule Appointment"/></div>
                                            <div className={`text-gray-400`}><TextView
                                                text="Notifies clients of their appointment if it was rescheduled"/>
                                            </div>
                                        </div>
                                        {/**Enabled or Disabled **/}
                                        <div className={`flex justify-between text-xs m-2`}>
                                            <div className={`bg-green-300 rounded p-2 font-bold`}>
                                                <TextView text="Enabled"/>
                                            </div>
                                            <div className={`text-green-300 rounded p-2`}>
                                                <FaEnvelope/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`m-2 border-2 w-64`}>
                                        <div className={`p-7 `}>
                                            <div><FaCalendarXmark className={`text-green-900`} size={22}/></div>
                                            <div className={`font-bold`}><TextView
                                                text="Cancelled Appointment"/></div>
                                            <div className={`text-gray-400`}><TextView
                                                text="Notifies Client if their booked appointment was cancelled"/>
                                            </div>
                                        </div>
                                        {/**Enabled or Disabled **/}
                                        <div className={`flex justify-between text-xs m-2`}>
                                            <div className={`bg-green-300 rounded p-2 font-bold`}>
                                                <TextView text="Enabled"/>
                                            </div>
                                            <div className={`text-green-300 rounded p-2`}>
                                                <FaEnvelope/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`m-2 border-2 w-64`}>
                                        <div className={`p-7 `}>
                                            <div><FaRegEyeSlash className={`text-green-900`} size={22}/></div>
                                            <div className={`font-bold`}><TextView
                                                text="Did not Show up"/></div>
                                            <div className={`text-gray-400`}><TextView
                                                text="Automatically sends a client when their appointment is marked as a no-show"/>
                                            </div>
                                        </div>
                                        {/**Enabled or Disabled **/}
                                        <div className={`flex justify-between text-xs m-2`}>
                                            <div className={`bg-green-300 rounded p-2 font-bold`}>
                                                <TextView text="Enabled"/>
                                            </div>
                                            <div className={`text-green-300 rounded p-2`}>
                                                <FaEnvelope/>
                                            </div>
                                        </div>
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

export default MarketingPage;
