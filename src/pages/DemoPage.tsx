// src/pages/DemoPage.tsx
import React, { useState } from 'react';
import TextView from "../components/TextViewComponent/TextView";// Adjust the path as necessary
import Checkbox from "../components/CheckBoxComponent/Checkbox";
import Avatar from '../components/AvatarComponent/Avatar'; // Adjust the path as necessary
import InputText from "../components/InputTextComponent/InputText";
import DropdownButton from "../components/DropdownButtonComponent/DropdownButton";
import Button from "../components/ButtonComponent/Button";
const DemoPage: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState< string | number | boolean | null>(null);

    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    const handleClick = () => {
        alert('Button clicked!');
    };

    const options = ['Option 1', 'Option 2', 'Option 3'];

    const handleOptionSelect = (option:  string | number | boolean) => {
        setSelectedOption(option);
        // Add any additional logic here upon option selection
    };
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Kim's Design System</h1>
            <section className="mb-6 p-4 border border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">TextView Component</h2>
                <TextView text="This is a plain text component"/>
                <pre className="bg-gray-100 p-2 mt-4 rounded-md">
                    {`<TextView text="This is a plain text component" />`}
                </pre>
            </section>
            <section className="mb-6 p-4 border border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">TextInput Component</h2>
                <InputText placeholder="Enter text here"/>
                <pre className="bg-gray-100 p-2 mt-4 rounded-md">
                    {`<InputText placeholder="Enter text here" value="" maxlength="" name=""/>`}
                </pre>
            </section>
            <section className="mb-6 p-4 border border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Checkbox Component</h2>
                <Checkbox
                    id="cbtest-1"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    value="testValue"
                    size="35px"
                />
                <pre className="bg-gray-100 p-2 mt-4 rounded-md">
                    {`<Checkbox id="cbtest-19" checked={isChecked} onChange={handleCheckboxChange} value="testValue" size="35px" />`}
                </pre>
            </section>
            <section className="mb-6 p-4 border border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Avatar Component</h2>
                <Avatar imageUrl="https://place-hold.it/75x75" name="UI" size="75px"/>
                <pre className="bg-gray-100 p-2 mt-4 rounded-md">
                    {`<Avatar imageUrl="https://place-hold.it/75x75" name="UI" size="75px"/>`}
                </pre>
            </section>
            <section className="mb-6 p-4 border border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">DropdownButton Component</h2>
                <DropdownButton options={options} onSelect={handleOptionSelect}/>
                <p className="mt-2">Selected Option: {selectedOption ?? 'None'}</p>
                <pre className="bg-gray-100 p-2 mt-4 rounded-md">
                    {`<DropdownButton options={options} onSelect={handleOptionSelect}/>`}
                </pre>
            </section>
            <section className="mb-6 p-4 border border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Button Component</h2>
                <Button onClick={handleClick}>Click Me</Button>
                <pre className="bg-gray-100 p-2 mt-4 rounded-md">
                    {`<Button onClick={handleClick}>Click Me</Button>`}
                </pre>
            </section>

        </div>
    );

};

export default DemoPage;
