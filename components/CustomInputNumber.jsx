import React from "react";
import Image from "next/image";
import useContinuousCounter from "@/hook/useContinuousCounter";

const CustomInputNumber = ({ guestNumber, onChange, max }) => {
  const {
    value,
    startContinuousChange,
    stopContinuousChange,
    handleOneClick,
    updateValue,
  } = useContinuousCounter(guestNumber);

  const handleChange = (type) => {
    const newValue = type === "increment" ? value + 1 : value - 1;

    if (newValue >= 0 && newValue <= max) {
      handleOneClick(type);
      onChange(newValue);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    console.log("Raw value:", newValue);

    // Validate the newValue
    const isValidNumber = (value) => {
      // Check if the value is empty or a valid integer
      return value === "" || /^[0-9]+$/.test(value);
    };

    // Check if the newValue is valid
    if (isValidNumber(newValue)) {
      // Convert newValue to number for state update
      const numericValue = newValue === "" ? "" : parseInt(newValue, 10);
      // Ensure the numericValue is within range
      if (numericValue >= 0 && numericValue <= max) {
        updateValue(numericValue);
      }
    }
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <button
        id="plus-btn"
        onMouseDown={() => startContinuousChange("decrement")}
        onMouseUp={stopContinuousChange}
        onMouseLeave={stopContinuousChange}
        onClick={() => handleChange("decrement")}
      >
        <Image
          src="/minus.svg"
          width={48}
          height={48}
          alt="Picture of the author"
          className="border-blue-400 border-[3px] rounded-[6px]"
          draggable={false}
        />
      </button>
      <input
        className="w-12 h-12 p-2 border-gray-300 border-[3px] rounded-[6px] appearance-none"
        type="number"
        value={value}
        min={0}
        step={1}
        id="customer-number"
        required
        onChange={handleInputChange}
      />
      <button
        id="minus-btn"
        onMouseDown={() => startContinuousChange("increment")}
        onMouseUp={stopContinuousChange}
        onMouseLeave={stopContinuousChange}
        onClick={() => handleChange("increment")}
      >
        <Image
          src="/plus.svg"
          width={48}
          height={48}
          alt="Picture of the author"
          className="border-blue-400 border-[3px] rounded-[6px]"
          draggable={false}
        />
      </button>
    </div>
  );
};

export default CustomInputNumber;
