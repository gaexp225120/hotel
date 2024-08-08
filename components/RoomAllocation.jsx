import React, { useState } from "react";
import CustomInputNumber from "./CustomInputNumber";

const RoomAllocation = (props) => {
  console.log("props", props.roomData);
  const { adult, child, capacity } = props.roomData;

  const [adultCount, setAdultCount] = useState(adult);
  const [childCount, setChildCount] = useState(child);

  // Calculate maximum values
  const maxAdults = capacity - childCount;
  const maxChildren = capacity - adultCount;

  const handleAdultChange = (newCount) => {
    if (newCount >= 0 && newCount <= maxAdults) {
      setAdultCount(newCount);
    }
  };

  const handleChildChange = (newCount) => {
    if (newCount >= 0 && newCount <= maxChildren) {
      setChildCount(newCount);
    }
  };

  return (
    <div className="w-full flex flex-row items-center my-6">
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-row items-center justify-between my-4">
          <div>
            <p>大人</p>
            <p>年齡 20+</p>
          </div>
          <CustomInputNumber
            guestNumber={adultCount}
            onChange={handleAdultChange}
            max={maxAdults}
          />
        </div>
        <div className="w-full flex flex-row items-center justify-between my-4">
          <p>小孩</p>
          <CustomInputNumber
            guestNumber={childCount}
            onChange={handleChildChange}
            max={maxChildren}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomAllocation;
