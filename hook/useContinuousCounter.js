import { useState, useRef, useCallback } from "react";

const useContinuousCounter = (initialValue) => {
  const min = 0;
  const [value, setValue] = useState(initialValue);
  const intervalRef = useRef(null);

  const updateValue = (newValue) => {
    setValue(newValue);
  };

  const handleOneClick = (type) => {
    setValue((prevValue) => {
      if (type === "decrement") {
        return prevValue > min ? prevValue - 1 : min;
      } else {
        return prevValue + 1;
      }
    });
  };

  const startContinuousChange = (type) => {
    intervalRef.current = setInterval(() => {
      setValue((prevValue) => {
        if (type === "decrement") {
          return prevValue > min ? prevValue - 1 : min;
        } else {
          return prevValue + 1;
        }
      });
    }, 200);
  };

  const stopContinuousChange = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return {
    value,
    handleOneClick,
    startContinuousChange,
    stopContinuousChange,
    updateValue,
  };
};

export default useContinuousCounter;
