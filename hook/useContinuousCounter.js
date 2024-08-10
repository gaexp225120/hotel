import { useState, useRef, useCallback } from "react";

const useContinuousCounter = (max) => {
  const min = 0;
  const intervalRef = useRef(null);

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
    startContinuousChange,
    stopContinuousChange,
  };
};

export default useContinuousCounter;
