import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type MyDatePickerProps = {
  onDateChange: (date: Date | null) => void; // Prop type for the callback function
};

const MyDatePicker: React.FC<MyDatePickerProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const handleChange = (date: Date | null) => {
    setStartDate(date);
    onDateChange(date); // Call the callback function from the parent
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={handleChange}
      inline // Calendar always visible
    />
  );
};

export default MyDatePicker;