import React, {useEffect, useState} from 'react';
import countries from "../../data/country.json";
import styles from "../../pages/styles/ClientStyle.module.css";
import TextView from "../TextViewComponent/TextView";
import Avatar from "../AvatarComponent/Avatar";
import {FaCamera} from "react-icons/fa";
import InputText from "../InputTextComponent/InputText";
import Select from "../SelectComponent/Select";
import GetDatePicker from "../DatePickerComponent/GetDatePicker";
import RadioButton from "../RadioButtonComponent/RadioButton";
import Button from "../ButtonComponent/Button";
import { allCountries } from 'country-telephone-data';
import {Client} from "../../types/Client";
import NotificationModal from "../NotificationModalComponent/NotificationModal";
import {generateMicrotime} from "../../utilities/microTimeStamp";

interface ClientFormProps {
    id?: string | number;
    existingFormData?: Client;
    saveData: (data: Client) => void;
}

interface CountryOption {
    label: string;
    value: string;
}

const ClientForm: React.FC<ClientFormProps> = ({ id, existingFormData, saveData }) => {
    const [notificationModalOpen, setNotificationModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);
    const [message, setMessage] = useState('');

    const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);

    const countryCodeOptions = allCountries.map((country) => ({
        value: country.dialCode,
        label: `${country.name} (${country.dialCode})`,
    }));
    const countryValue = countryCodeOptions.map((country) => '+' + country.value).sort()
        .filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    useEffect(() => {
        const countryOptions = countries.map((country: any) => ({
            label: country.name.common,
            value: country.cca2 || country.name.common

        }));
        setCountryOptions(countryOptions);
    }, []);


    const [formData, setFormData] = useState<Client>({
        id: generateMicrotime().toString(),
        firstName: '',
        lastName: '',
        email: '',
        birthday: '',
        areaCode: '+63',
        contactNumber: '',
        clientSource: '',
        countryCode: 'Philippines',
        address: '',
        city: '',
        province: '',
        zipcode: '',
        gender: ''
    });



    const resetForm = () => {
        setFormData({
            id:'0',
            firstName: '',
            lastName: '',
            email: '',
            birthday: '',
            areaCode: '+63',
            contactNumber: '',
            clientSource: '',
            countryCode: '',
            address: '',
            city: '',
            province: '',
            zipcode: '',
            gender: ''
        });
    };

    const fieldLabels: { [key: string]: string } = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        contactNumber: 'Phone Number',
        birthday: 'Birthday',
        gender: 'Gender',
        clientSource: 'Client Source',
        address: 'Address',
        city: 'City',
        province: 'Province',
        countryCode: 'Country',
    };

    const handleClick = () => {
        const missingFields = Object.entries(formData).filter(([key, value]) => {
            if (key === 'zipcode' || key === 'areaCode') return false;
            return !value;
        });

        if (missingFields.length > 0) {
            setIsSuccess(false);
            setNotificationModalOpen(true);
            setMessage(
                `Please fill out the following fields: ${missingFields
                    .map(([key]) => fieldLabels[key] || key)
                    .join(', ')}`
            );
            return;
        }
        setFormData((prev) => ({...prev, id: generateMicrotime().toString()}))
        saveData(formData);
    };

    return (
        <div className="flex flex-col lg:flex-row">
            <NotificationModal
                isOpen={notificationModalOpen}
                onClose={() => setNotificationModalOpen(false)}
                message={message}
                isSuccess={isSuccess}
            />
            <div className="mt-2 p-4 lg:mr-4 flex flex-col items-start border border-gray-300 h-fit ">
                <div className={`m-6 ${styles.clientAddContentHeading}`}>
                    <TextView text="Profile"/>
                </div>
                <div className="m-6 relative">
                    <Avatar size="105px"/>
                    <span
                        className={`absolute bottom-0 right-2 transform translate-x-1/2 -translate-y-1/2 ${styles.uploadProfilePicture}`}>
                                    <FaCamera/>
                                </span>
                </div>
                <div className="flex flex-wrap w-full">
                    <div className="m-2 w-full lg:w-1/3">
                        <InputText
                            placeholder="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={(e) =>
                                setFormData((prev) => ({...prev, firstName: e.target.value}))
                            }
                        />
                    </div>
                    <div className="m-2 w-full lg:w-1/2">
                        <InputText
                            placeholder="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={(e) =>
                                setFormData((prev) => ({...prev, lastName: e.target.value}))
                            }
                        />
                    </div>
                </div>
                <div className="flex flex-wrap w-full">
                    <div className="m-2 w-full lg:w-1/3">
                        <InputText
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData((prev) => ({...prev, email: e.target.value}))
                            }
                        />
                    </div>
                    <div className="m-2 flex  w-full lg:w-1/2">
                        <Select name="areaCode" value={formData.areaCode }
                                className={`w-[50%] border-r border-r-green-600`}
                                onChange={(e) =>
                                    setFormData((prev) => ({...prev, areaCode: e.target.value}))
                                }
                        >
                            {countryValue.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </Select>
                        <InputText
                            placeholder="Phone"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={(e) =>
                                setFormData((prev) => ({...prev, contactNumber: e.target.value}))
                            }
                        />
                    </div>
                </div>
                <div className="flex flex-wrap w-full">
                    <div className="m-2 w-full lg:w-1/3">
                        <GetDatePicker
                            onDateChange={(date) => {
                            setFormData((prev) => ({
                                ...prev,
                                birthday: date ? date.toISOString().split('T')[0] : '', // Format date as YYYY-MM-DD
                            }));
                        }}/>
                    </div>
                    <div className="m-2 flex">
                        <div className={`m-2`}>
                            <RadioButton
                                label="Male"
                                name="options"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={(e) =>
                                    setFormData((prev) => ({...prev, gender: e.target.value}))
                                }
                                orientation="side-by-side"
                            />
                        </div>
                        <div className={`m-2`}>
                            <RadioButton
                                label="Female"
                                name="options"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={(e) =>
                                    setFormData((prev) => ({...prev, gender: e.target.value}))
                                }
                                orientation="side-by-side"
                            />
                        </div>
                        <div className={`m-2`}>
                            <RadioButton
                                label="Non Binary"
                                name="options"
                                value="nonbinary"
                                checked={formData.gender === 'nonbinary'}
                                onChange={(e) =>
                                    setFormData((prev) => ({...prev, gender: e.target.value}))
                                }
                                orientation="side-by-side"
                            />
                        </div>
                    </div>
                </div>
                <div className="m-2 w-full">
                    <InputText
                        placeholder="Client Source"
                        name="clientSource"
                        value={formData.clientSource}
                        onChange={(e) =>
                            setFormData((prev) => ({...prev, clientSource: e.target.value}))
                        }
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
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData((prev) => ({...prev, address: e.target.value}))
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap w-full">
                        <div className="m-2 lg:w-1/6">

                            <Select name="countrySelected"
                                    value={formData.countryCode }
                                    className={`w-[100%] `}
                                    onChange={(e) =>
                                        setFormData((prev) => ({...prev, countryCode: e.target.value}))
                                    }
                            >
                                {countryOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label} ({option.value})
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div className="m-2 w-full lg:w-1/3">
                            <InputText
                                placeholder="City"
                                name="city"
                                value={formData.city}
                                onChange={(e) =>
                                    setFormData((prev) => ({...prev, city: e.target.value}))
                                }
                            />
                        </div>
                        <div className="m-2 w-full lg:w-1/3">
                            <InputText
                                placeholder="Province"
                                name="province"
                                value={formData.province}
                                onChange={(e) =>
                                    setFormData((prev) => ({...prev, province: e.target.value}))
                                }
                            />
                        </div>
                        <div className="m-2 w-full lg:w-1/3">
                            <InputText
                                placeholder="Zipcode"
                                name="zipcode"
                                value={formData.zipcode}
                                onChange={(e) =>
                                    setFormData((prev) => ({...prev, zipcode: e.target.value}))
                                }
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
    )

}
export default ClientForm;
