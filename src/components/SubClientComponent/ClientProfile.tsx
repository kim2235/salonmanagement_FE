import React, {useEffect, useState} from "react";
import InputText from "../InputTextComponent/InputText";
import DropdownButton from "../DropdownButtonComponent/DropdownButton";
import GetDatePicker from "../DatePickerComponent/GetDatePicker";
import RadioButton from "../RadioButtonComponent/RadioButton";
import {allCountries} from "country-telephone-data";
import countries from "../../data/country.json";
import {Client, ClientProfileProps} from "../../types/Client";
import Select from "../SelectComponent/Select";

interface CountryOption {
    label: string;
    value: string;
}

const ClientProfile: React.FC<ClientProfileProps> = ({ clientData, onClientUpdate }) => {
    // Client Details State
    const [formData, setFormData] = useState<Client>({
        id: '0',
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

    // Populate initial values from the parent component
    useEffect(() => {
        if (clientData) {
            console.log(clientData,clientData.city )
            setFormData((prev) => ({...prev,
                    firstName: clientData.firstName,
                    lastName: clientData.lastName,
                    email: clientData.email,
                    birthday: clientData.birthday,
                    areaCode: clientData.areaCode,
                    contactNumber: clientData.contactNumber,
                    province: clientData.province,
                    gender: clientData.gender,
                    address: clientData.address,
                    countryCode: clientData.countryCode,
                    city: clientData.city,
                    zipcode: clientData.zipcode
                })
            )

        }
    }, [clientData]);


    // Update parent when any field changes
    const updateParent = () => {
        if (onClientUpdate) { // Check if onClientUpdate is defined

        }
    };



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

    return (
        <div id={`clientDetail`}>
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
                        name="phone"
                        value={formData.contactNumber}
                        onChange={(e) =>
                            setFormData((prev) => ({...prev, contactNumber: e.target.value}))
                        }
                    />
                </div>
                <div className="m-2 flex w-full">
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
                <div className="m-2 flex">
                    <div className="m-2 lg:w-1/2">
                        <Select name="countrySelected"
                                value={formData.countryCode}
                                className={`w-[100%] `}
                                onChange={(e) =>
                                    setFormData((prev) => ({...prev, countryCode: e.target.value}))
                                }
                        >
                            {countryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
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
                </div>
                <div className="m-2 flex">
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
        </div>
    );
};

export default ClientProfile;
