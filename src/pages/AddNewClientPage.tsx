import React, { useState } from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {useAppDispatch} from "../hook";
import {addOrUpdateClient} from "../redux/slices/clientSlice";
import styles from './styles/ClientStyle.module.css';
import { FaBars, FaArrowLeft, FaCamera } from 'react-icons/fa';
import TextView from '../components/TextViewComponent/TextView';
import ClientSidebar from '../components/Sidebars/ClientSidebarComponent/ClientSidebar';
import Button from '../components/ButtonComponent/Button';
import { useNavigate } from 'react-router-dom';
import { allCountries } from 'country-telephone-data';
import countries from '../data/country.json';
import {sidebarItems} from "./menuitems/sidebarItems";
import ClientForm from "../components/ClientFormComponent/ClientForm";
import {Client} from "../types/Client";

const AddNewClientPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [activeItem, setActiveItem] = useState<string | null>('clientlist');
    const [selectedOption, setSelectedOption] = useState< string | number | boolean | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const clients = useSelector((state: RootState) => state.clients.valueClients);

    const handleItemClick = (id: string, type: 'link' | 'div') => {
        setActiveItem(id);

        if (type === 'link') {
            const item = sidebarItems.find((item) => item.id === id);
            if (item?.href) {
                navigate(item.href); // Use the `href` value for navigation
            }
        }
    };


    console.log(clients)
    const handleClick = () => {
         navigate('/clientlist');
    };


    const saveFormData = (data: Client ) => {
        dispatch(addOrUpdateClient(data));
    };


    return (
        <div id={styles.sub_container} className="flex flex-col lg:flex-row">
            <div className="lg:hidden p-4 flex justify-between items-center">
                <button className="text-2xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <FaBars />
                </button>
                <span className="text-xl">Clients</span>
            </div>
            <div className={`lg:flex-none lg:p-4 border-r border-r-gray-300 lg:w-1/8 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div className={`${isSidebarOpen ? styles.pageLabel + ' hidden' : styles.pageLabel + ' hidden lg:block'}`}>
                    <TextView text="Clients" />
                </div>
                <ClientSidebar items={sidebarItems} onItemClick={handleItemClick} activeItem={activeItem} />
            </div>
            <div className="flex-1 p-4">
                <div id="clientHeading" className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center">
                            <div className={`${styles.pageContentHeading} mr-3`}>
                                <TextView text="Add a new Client" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <Button onClick={handleClick}>
                            <FaArrowLeft className="mr-2" />
                            Go Back to Client List
                        </Button>
                    </div>
                </div>
                <ClientForm saveData={saveFormData}/>
            </div>
        </div>
    );
};

export default AddNewClientPage;
