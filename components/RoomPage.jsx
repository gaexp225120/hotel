"use client";
import React, { useState } from "react";
import RoomAllocation from "./RoomAllocation";

const RoomPage = (props) => {
  const [guest, setGuest] = useState({ adult: 4, child: 2 });
  const [rooms, setRooms] = useState([
    { roomPrice: 1000, adultPrice: 200, childPrice: 100, capacity: 4 },
    { roomPrice: 0, adultPrice: 500, childPrice: 500, capacity: 4 },
    { roomPrice: 500, adultPrice: 300, childPrice: 200, capacity: 4 },
  ]);

  const handleRoomAllocationChange = (result) => {
    console.log("Room Allocation Result:", result);
  };

  return (
    <div>
      <div className="text-[20px] font-bold">{`住客人數:${guest.adult}位大人，${guest.child}位小孩 / ${rooms.length}房`}</div>
      <RoomAllocation
        guest={guest}
        rooms={rooms}
        onChange={handleRoomAllocationChange}
      />
    </div>
  );
};

export default RoomPage;
