import React, { useState } from 'react';
import styles from './styles/ClientStyle.module.css';
import { FaBars, FaArrowLeft, FaCamera } from 'react-icons/fa';
import TextView from '../components/TextViewComponent/TextView';
import ClientSidebar from '../components/Sidebars/ClientSidebarComponent/ClientSidebar';
import Button from '../components/ButtonComponent/Button';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/AvatarComponent/Avatar';
import InputText from '../components/InputTextComponent/InputText';
import { allCountries } from 'country-telephone-data';
import countries from '../data/country.json';
import DropdownButton from '../components/DropdownButtonComponent/DropdownButton';
import GetDatePicker from '../components/DatePickerComponent/GetDatePicker';
import RadioButton from "../components/RadioButtonComponent/RadioButton";
import {sidebarItems} from "./menuitems/sidebarItems";

const AddNewClientPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState<string | null>('clientlist');
    const [selectedOption, setSelectedOption] = useState< string | number | boolean | null>(null);
    const [selectedGenderOption, setSelectedGenderOption] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedRadioOption, setSelectedRadioOption] = useState('option1');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [clientSource, setClientSource] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [zip, setZip] = useState('');

    const handleItemClick = (id: string, type: 'link' | 'div') => {
        setActiveItem(id);
        if (type === 'link') {
            navigate(id);
        }
    };

    const countryOptions = allCountries.map((country) => ({
        value: country.dialCode,
        label: `${country.name} (${country.dialCode})`,
    }));

    const countriesOptions = countries.map((country: any) => ({
        label: country.name.common,
        value: country.cca2,
    }));

    const handleClick = () => {
        navigate('/clientlist');
    };

    const handleOptionSelect = (option:  string | number | boolean) => {
        setSelectedOption(option);
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRadioOption(e.target.value);
    };

    const handleOptionGenderSelect = (option: string) => {
        setSelectedGenderOption(option);
    };

    const countryValue = countryOptions.map((country) => '+' + country.value).sort();
    const countriesValue = countriesOptions.map((country) => country.label).sort();

    const options = countryValue.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });

    const countriesListOptions = countriesValue.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });

    const genderOption = ['Male', 'Female', 'Nonbinary'];
    const index = options.indexOf('+63');
    const indexCountry = countriesListOptions.indexOf('Philippines');

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setClientSource('');
        setAddress('');
        setCity('');
        setProvince('');
        setZip('');
        setSelectedOption(null);
        setSelectedGenderOption(null);
        setSelectedRadioOption('option1');
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
                <div className="flex flex-col lg:flex-row">
                    <div className="mt-2 p-4 lg:mr-4 flex flex-col items-start border border-gray-300 h-fit ">
                        <div className={`m-6 ${styles.clientAddContentHeading}`}>
                            <TextView text="Profile" />
                        </div>
                        <div className="m-6 relative">
                            <Avatar size="105px" />
                            <span className={`absolute bottom-0 right-2 transform translate-x-1/2 -translate-y-1/2 ${styles.uploadProfilePicture}`}>
                                <FaCamera />
                            </span>
                        </div>
                        <div className="flex flex-wrap w-full">
                            <div className="m-2 w-full lg:w-1/3">
                                <InputText
                                    placeholder="First Name"
                                    name="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="m-2 w-full lg:w-1/2">
                                <InputText
                                    placeholder="Last Name"
                                    name="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap w-full">
                            <div className="m-2 w-full lg:w-1/3">
                                <InputText
                                    placeholder="Email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="m-2 flex items-center w-full lg:w-1/2">
                                <DropdownButton
                                    options={options}
                                    onSelect={handleOptionSelect}
                                    defaultSelected={options[index]}

                                />
                                <InputText
                                    placeholder="Phone"
                                    name="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap w-full">
                            <div className="m-2 w-full lg:w-1/3">
                                <GetDatePicker />
                            </div>
                            <div className="m-2 flex">
                                <div className={`m-2`}>
                                    <RadioButton
                                        label="Male"
                                        name="options"
                                        value="option1"
                                        checked={selectedRadioOption === 'option1'}
                                        onChange={handleOptionChange}
                                        orientation="side-by-side"
                                    />
                                </div>
                                <div className={`m-2`}>
                                    <RadioButton
                                        label="Female"
                                        name="options"
                                        value="option2"
                                        checked={selectedRadioOption === 'option2'}
                                        onChange={handleOptionChange}
                                        orientation="side-by-side"
                                    />
                                </div>
                                <div className={`m-2`}>
                                    <RadioButton
                                        label="Non Binary"
                                        name="options"
                                        value="option3"
                                        checked={selectedRadioOption === 'option3'}
                                        onChange={handleOptionChange}
                                        orientation="side-by-side"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="m-2 w-full">
                            <InputText
                                placeholder="Client Source"
                                name="clientSource"
                                value={clientSource}
                                onChange={(e) => setClientSource(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-2 lg:mr-4 flex flex-col items-start h-fit lg:w-1/2">
                        <div className="flex flex-col items-start border border-gray-300 h-fit w-full">
                            <div className={`m-6 ${styles.clientAddContentHeading}`}>
                                <TextView text="Address"/>
                            </div>
                            <div className="flex flex-wrap w-full">
                                <div className="m-2 w-full">
                                    <InputText
                                        placeholder="Enter Address"
                                        name="addressField"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap w-full">
                                <div className="m-2 lg:w-1/6">
                                    <DropdownButton
                                        options={countriesListOptions}
                                        onSelect={handleOptionSelect}
                                        defaultSelected={countriesListOptions[indexCountry]}

                                    />
                                </div>
                                <div className="m-2 w-full lg:w-1/3">
                                    <InputText
                                        placeholder="City"
                                        name="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <div className="m-2 w-full lg:w-1/3">
                                    <InputText
                                        placeholder="Province"
                                        name="province"
                                        value={province}
                                        onChange={(e) => setProvince(e.target.value)}
                                    />
                                </div>
                                <div className="m-2 w-full lg:w-1/3">
                                    <InputText
                                        placeholder="Zipcode"
                                        name="zip"
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col items-start h-fit w-full">
                            <div className="flex items-center justify-between">
                                <div className={`mr-4`}>
                                    <Button onClick={handleClick}>
                                        Save
                                    </Button>
                                </div>
                                <div className={`mr-4`}>
                                    <Button onClick={resetForm} variant="transparent">
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewClientPage;
