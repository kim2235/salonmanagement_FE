import React, {useEffect, useState} from "react";
import InputText from "../InputTextComponent/InputText";
import DropdownButton from "../DropdownButtonComponent/DropdownButton";
import GetDatePicker from "../DatePickerComponent/GetDatePicker";
import RadioButton from "../RadioButtonComponent/RadioButton";
import {allCountries} from "country-telephone-data";
import countries from "../../data/country.json";
import {ClientProfileProps} from "../../types/Client";
const ClientProfile: React.FC<ClientProfileProps> = ({ clientData, onClientUpdate }) => {
    // Client Details State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedRadioOption, setSelectedRadioOption] = useState('option1');
    const [clientSource, setClientSource] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [zip, setZip] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | number | boolean | null>(null);

    // Populate initial values from the parent component
    useEffect(() => {
        if (clientData) { // Check if clientData is defined
            setFirstName(clientData.firstName || '');
            setLastName(clientData.lastName || '');
            setEmail(clientData.email || '');
            setPhone(clientData.contactNumber || '');
            setSelectedRadioOption(clientData.gender || 'option1');
            setClientSource(clientData.clientSource || '');
            setAddress(clientData.address || '');
            setCity(clientData.city || '');
            setProvince(clientData.province || '');
            setZip(clientData.zip || '');
            setSelectedOption(clientData.countryCode || null);
        }
    }, [clientData]);


    // Update parent when any field changes
    const updateParent = () => {
        if (onClientUpdate) { // Check if onClientUpdate is defined
            onClientUpdate({
                firstName,
                lastName,
                email,
                phone,
                gender: selectedRadioOption,
                clientSource,
                address,
                city,
                province,
                zip,
                countryCode: selectedOption,
            });
        }
    };


    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRadioOption(e.target.value);
        updateParent();
    };

    const handleOptionSelect = (option: string | number | boolean) => {
        setSelectedOption(option);
        updateParent();
    };

    // List of countries
    const countryOptions = allCountries.map((country) => ({
        value: country.dialCode,
        label: `${country.name} (${country.dialCode})`,
    }));

    const countriesOptions = countries.map((country: any) => ({
        label: country.name.common,
        value: country.cca2,
    }));

    // Sorting and filtering country lists
    const countriesValue = countriesOptions.map((country) => country.label).sort();
    const countryValue = countryOptions.map((country) => '+' + country.value).sort();
    const countriesListOptions = countriesValue.filter((value, index, self) => self.indexOf(value) === index);
    const options = countryValue.filter((value, index, self) => self.indexOf(value) === index);

    const indexCountry = countriesListOptions.indexOf('Philippines');
    const index = options.indexOf('+63');

    return (
        <div id={`clientDetail`}>
            <div className="flex flex-wrap w-full">
                <div className="m-2 w-full lg:w-1/3">
                    <InputText
                        placeholder="First Name"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                            updateParent();
                        }}
                    />
                </div>
                <div className="m-2 w-full lg:w-1/2">
                    <InputText
                        placeholder="Last Name"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                            updateParent();
                        }}
                    />
                </div>
                <div className="m-2 w-full lg:w-1/3">
                    <InputText
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            updateParent();
                        }}
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
                        onChange={(e) => {
                            setPhone(e.target.value);
                            updateParent();
                        }}
                    />
                </div>
                {/* Remaining fields */}
                {/* Example for RadioButton */}
                <div className="m-2 flex">
                    <RadioButton
                        label="Male"
                        name="options"
                        value="option1"
                        checked={selectedRadioOption === 'option1'}
                        onChange={handleOptionChange}
                        orientation="side-by-side"
                    />
                    <RadioButton
                        label="Female"
                        name="options"
                        value="option2"
                        checked={selectedRadioOption === 'option2'}
                        onChange={handleOptionChange}
                        orientation="side-by-side"
                    />
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
    );
};

export default ClientProfile;
