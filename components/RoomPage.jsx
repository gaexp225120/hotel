"use client";
import React, { useState, useEffect } from "react";
import RoomAllocation from "./RoomAllocation";
import {
  getDefaultRoomAllocation,
  getRemainingGuests,
} from "../utils/helperFunc";
import { ADULT } from "./constants/constants";

const guest = { adult: 4, child: 2 };
const rooms = [
  { roomPrice: 1000, adultPrice: 200, childPrice: 100, capacity: 4 },
  { roomPrice: 0, adultPrice: 500, childPrice: 500, capacity: 4 },
  { roomPrice: 500, adultPrice: 300, childPrice: 200, capacity: 4 },
];

const RoomPage = () => {
  const [allocations, setAllocations] = useState([]);
  const [remainingGuests, setRemainingGuests] = useState({
    adult: guest.adult,
    child: guest.child,
  });

  const handleRoomAllocationChange = (roomIndex, type, value) => {
    const newAllocations = allocations.map((alloc, index) => {
      if (index !== roomIndex) return alloc;
      const updatedAlloc = { ...alloc, [type]: value };
      let newPrice;
      if (type === ADULT && value === 0) {
        updatedAlloc.child = 0;
        newPrice = 0;
        return { ...updatedAlloc, price: newPrice };
      }

      newPrice =
        rooms[index].roomPrice +
        updatedAlloc.adult * rooms[index].adultPrice +
        updatedAlloc.child * rooms[index].childPrice;

      return { ...updatedAlloc, price: newPrice };
    });

    setRemainingGuests(getRemainingGuests(newAllocations, guest));
    setAllocations(newAllocations);

    console.log("Updated Allocations:", newAllocations);
  };

  useEffect(() => {
    const initialAllocations = getDefaultRoomAllocation(guest, rooms);
    console.log("Initial Allocations:", initialAllocations);
    setAllocations(initialAllocations);
    setRemainingGuests(getRemainingGuests(initialAllocations, guest));
  }, []);

  return (
    <div>
      <div className="text-[22px] font-bold my-2">{`住客人數：${guest.adult}位大人，${guest.child}位小孩 / ${rooms.length}房`}</div>
      <div className="text-[18px] text-gray-700 bg-blue-100 py-5 px-3 rounded-[6px]">{`尚未分配人數：${remainingGuests.adult}位大人，${remainingGuests.child}位小孩`}</div>
      <RoomAllocation
        guest={guest}
        rooms={rooms}
        allocations={allocations}
        setAllocations={setAllocations}
        onChange={handleRoomAllocationChange}
      />
    </div>
  );
};

export default RoomPage;
