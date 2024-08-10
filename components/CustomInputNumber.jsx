import React, { useRef } from "react";
import Image from "next/image";

const DECREMENT = "decrement";
const INCREMENT = "increment";

function CustomInputNumber({
  min,
  max,
  step,
  name,
  value,
  adultNumber,
  onChange,
  onBlur,
  disabled,
}) {
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const latestValueRef = useRef(value);
  const isLongPress = useRef(false); // Flag to track if it's a long press

  console.log("disabled", name, disabled);

  const minDisabled = () => {
    return value <= min;
  };

  const maxDisabled = () => {
    if (name.includes("child")) {
      if (adultNumber < 1) return true;
    }
    return value >= max;
  };

  const handleClick = (type) => {
    if (!isLongPress.current) {
      // If it's not a long press, handle single click
      if (type === "decrement") {
        handleDecrement();
      } else {
        handleIncrement();
      }
    }
  };

  const handleIncrement = () => {
    if (name.includes("child")) {
      if (latestValueRef.current < max && adultNumber > 0) {
        onChange({ target: { name, value: latestValueRef.current + step } });
      }
    } else if (latestValueRef.current < max) {
      onChange({ target: { name, value: latestValueRef.current + step } });
    }
  };

  const handleDecrement = () => {
    if (latestValueRef.current > min) {
      onChange({ target: { name, value: latestValueRef.current - step } });
    }
  };

  const startContinuousChange = (type) => {
    isLongPress.current = true;
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (type === "decrement") {
          handleDecrement();
        } else {
          handleIncrement();
        }
      }, 100); // Continuous change interval time
    }, 500); // Initial delay before continuous change starts
  };

  const stopContinuousChange = () => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    isLongPress.current = false;
  };

  const handleChange = (e) => {
    let inputValue = parseInt(e.target.value, 10);

    if (isNaN(inputValue)) {
      inputValue = 0;
    }

    if (inputValue < min) {
      inputValue = min;
    } else if (inputValue > max) {
      inputValue = max;
    }

    onChange({ target: { name, value: inputValue } });
  };

  // Update the latestValueRef whenever value changes
  React.useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  return (
    <div className="flex flex-row items-center gap-2">
      <button
        onClick={() => handleClick("decrement")}
        onMouseDown={() => startContinuousChange(DECREMENT)}
        onMouseUp={stopContinuousChange}
        onMouseLeave={stopContinuousChange}
        disabled={minDisabled()}
      >
        <Image
          src={minDisabled() ? "/minus-disabled.svg" : "/minus.svg"}
          width={48}
          height={48}
          alt="Picture of the author"
          className={`border-[3px] rounded-[6px] ${
            minDisabled()
              ? "border-grey-400 cursor-not-allowed"
              : "border-blue-400 hover:border-blue-600 "
          }`}
          draggable={false}
        />
      </button>
      <input
        className="w-12 h-12 p-2 border-gray-400 border-[3px] rounded-[6px] appearance-none"
        type="number"
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        onBlur={(e) => onBlur(e)}
        disabled={disabled}
      />
      <button
        onClick={() => handleClick("increment")}
        onMouseDown={() => startContinuousChange(INCREMENT)}
        onMouseUp={stopContinuousChange}
        onMouseLeave={stopContinuousChange}
        disabled={maxDisabled()}
      >
        <Image
          src={maxDisabled() ? "/plus-disabled.svg" : "/plus.svg"}
          width={48}
          height={48}
          alt="Picture of the author"
          className={`border-[3px] rounded-[6px] ${
            maxDisabled()
              ? "border-grey-400 cursor-not-allowed"
              : "border-blue-400 hover:border-blue-600"
          }`}
          draggable={false}
        />
      </button>
    </div>
  );
}

export default CustomInputNumber;
