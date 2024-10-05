import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './GetDatePicker.module.css';
import { FaCalendarAlt } from 'react-icons/fa';
const GetDatePicker: React.FC = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);

    return (
        <div className="relative">
            <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                className={`${styles.datePicker} customDatePicker border p-2  shadow-md `}
                popperClassName="react-datepicker-popper"
                showYearDropdown
                scrollableYearDropdown
                customInput={<CustomInput />}
                calendarClassName={styles.datepickerContainer}
                weekDayClassName={() => styles.dayName}
                monthClassName={() => styles.currentMonth}
                placeholderText="Select Birthdate"
            />
        </div>
    );
};

const CustomInput = React.forwardRef(({ value, onClick }: any, ref: any) => (
    <button
        type="button"
        onClick={onClick}
        ref={ref}
        className={`${styles.datePicker} border p-2  shadow-md flex items-center`}
    >
        <FaCalendarAlt color="#27ae60" className="mr-2" />
        {value || "Select Birthdate"}
    </button>
));
export default GetDatePicker;
