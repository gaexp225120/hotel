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
  // ref for interval
  const intervalRef = useRef(null);
  // ref for timeout
  const timeoutRef = useRef(null);
  // ref for current value
  const latestValueRef = useRef(value);
  // ref for check if it's long press
  const isLongPress = useRef(false);

  const minDisabled = () => {
    return value === 0;
  };

  const maxDisabled = () => {
    if (name.includes("child")) {
      if (adultNumber < 1) return true;
    }
    return value === max;
  };

  const handleClick = (type) => {
    if (!isLongPress.current) {
      if (type === "decrement") {
        handleDecrement();
      } else {
        handleIncrement();
      }
    }
  };

  const handleIncrement = () => {
    if (latestValueRef.current < max) {
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
      }, 100);
    }, 500);
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

  const handleBlur = () => {
    if (onBlur) {
      onBlur({ target: { name, value: latestValueRef.current.toString() } });
    }
  };

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
        onBlur={handleBlur}
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
        className={`w-12 h-12 p-2 border-[3px] rounded-[6px] outline-none appearance-none text-[16px] ${
          disabled ? "border-gray-400 cursor-not-allowed" : "border-gray-600 "
        }`}
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
        onBlur={handleBlur}
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
