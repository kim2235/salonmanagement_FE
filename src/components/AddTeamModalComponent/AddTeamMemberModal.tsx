import React, { useState } from 'react';
import {FaCamera, FaPlus} from 'react-icons/fa';
import Button from '../ButtonComponent/Button';
import { v4 as uuidv4 } from 'uuid';
import InputText from "../InputTextComponent/InputText";

interface TeamMember {
    id: string | number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    country: string;
    birthday: string;
    jobTitle: string;
}

interface AddTeamMemberModalProps {
    onClose: () => void;
    onAddTeamMember: (member: TeamMember) => void;
}

const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({ onClose, onAddTeamMember }) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [birthday, setBirthday] = useState<string>('');
    const [jobTitle, setJobTitle] = useState<string>('');

    const handleAddTeamMember = () => {
        if (firstName && lastName && email && phoneNumber && country && birthday && jobTitle) {
            const newMember: TeamMember = {
                id: uuidv4(),
                firstName,
                lastName,
                email,
                phoneNumber,
                country,
                birthday,
                jobTitle,
            };
            onAddTeamMember(newMember);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 relative"> {/* Modal width set to 50% */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-[-12px] mr-[-12px] w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white z-50"
                >
                    <FaPlus className="transform rotate-45"/>
                </button>
                <h2 className="text-xl font-semibold mb-4">Add Team Member</h2>
                <div className={`flex flex-col mb-2`}>
                    <div className={`flex mb-2`}>
                        <div>
                            <div className="w-32 h-32 bg-green-300 rounded-full flex items-center justify-center">
                                <FaCamera size={32}/>
                            </div>
                        </div>

                    </div>
                    <div className={`flex mb-2`}>
                        <div className={`w-1/2 pr-2`}>
                        <InputText placeholder="First Name" name="firstName"
                                       value={firstName}
                                       onChange={(e) => setFirstName(e.target.value)}/>
                        </div>
                        <div className={`w-1/2 pl-2`}>
                            <InputText placeholder="Last Name" name="lastName"
                                       value={lastName}
                                       onChange={(e) => setLastName(e.target.value)}/>
                        </div>
                    </div>

                    <div className={`flex mb-2`}>
                        <div className={`w-1/2 pr-2`}>
                            <InputText placeholder="Email" name="email"
                                       value={email}
                                       onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className={`w-1/2 pl-2`}>
                            <InputText placeholder="Contact Number" name="phone"
                                       value={phoneNumber}
                                       onChange={(e) => setPhoneNumber(e.target.value)}/>
                        </div>
                    </div>

                    <div className={`flex mb-2`}>
                        <div className={`w-1/2 pr-2`}>
                            <InputText placeholder="Country" name="country"
                                       value={country}
                                       onChange={(e) => setCountry(e.target.value)}/>
                        </div>
                        <div className={`w-1/2 pl-2`}>
                            <input
                                type="date"
                                placeholder="Birthday"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                className="mb-2 border p-2 w-full"
                            />
                        </div>
                    </div>

                    <InputText placeholder="Job Title" name="jobTitle"
                               value={jobTitle}
                               onChange={(e) => setJobTitle(e.target.value)}/>
                </div>


                <Button onClick={handleAddTeamMember} size="medium">
                    Add Team Member
                </Button>

            </div>
        </div>
    );
};

export default AddTeamMemberModal;
