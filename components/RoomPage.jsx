"use client";
import React, { useEffect, useState } from "react";
import RoomAllocation from "./RoomAllocation";

const calculateRoomPrice = (room, adults, children) => {
  if (adults === 0 && children > 0) return Infinity;
  if (adults + children > room.capacity) return Infinity;

  return room.roomPrice + room.adultPrice * adults + room.childPrice * children;
};

const getDefaultRoomAllocation = (guest, rooms) => {
  const { adult, child } = guest;

  // Helper function to find the minimum cost allocation
  const findAllocation = (adultsLeft, childrenLeft, rooms) => {
    if (adultsLeft < 0 || childrenLeft < 0) {
      return { price: Infinity, allocation: [] };
    }

    // Base case: if no guests are left
    if (adultsLeft === 0 && childrenLeft === 0) {
      return {
        price: 0,
        allocation: rooms.map((room) => ({
          adult: 0,
          child: 0,
          price: 0,
          capacity: room.capacity,
        })),
      };
    }

    let minPrice = Infinity;
    let bestAllocation = [];
    let usedRooms = new Set();

    for (const room of rooms) {
      for (
        let adultsInRoom = 1;
        adultsInRoom <= room.capacity && adultsInRoom <= adultsLeft;
        adultsInRoom++
      ) {
        for (
          let childrenInRoom = 0;
          childrenInRoom <= room.capacity - adultsInRoom &&
          childrenInRoom <= childrenLeft;
          childrenInRoom++
        ) {
          const roomPrice = calculateRoomPrice(
            room,
            adultsInRoom,
            childrenInRoom
          );
          const remaining = findAllocation(
            adultsLeft - adultsInRoom,
            childrenLeft - childrenInRoom,
            rooms.filter((r) => r !== room)
          );

          if (remaining.price === Infinity) continue; // Skip invalid allocations

          const totalPrice = roomPrice + remaining.price;
          if (totalPrice < minPrice) {
            minPrice = totalPrice;
            bestAllocation = [
              {
                adult: adultsInRoom,
                child: childrenInRoom,
                price: roomPrice,
                capacity: room.capacity,
              },
              ...remaining.allocation,
            ];
            usedRooms = new Set([...usedRooms, room.capacity]);
          }
        }
      }
    }

    // Create a default room allocation for all rooms
    const allRoomsAllocation = rooms.map((room) => ({
      adult: 0,
      child: 0,
      price: 0,
      capacity: room.capacity,
      used: usedRooms.has(room.capacity),
    }));

    return { price: minPrice, allocation: allRoomsAllocation };
  };

  return findAllocation(adult, child, rooms).allocation;
};

const RoomPage = (props) => {
  const { guest, rooms } = props;
  const [roomResult, setRoomResult] = useState(null);
  console.log(guest);
  console.log(rooms);

  useEffect(() => {
    const result = getDefaultRoomAllocation(guest, rooms);
    console.log(result);
    setRoomResult(result);
  }, []);

  return (
    <div>
      <div>
        <p>{`住客人數:${guest.adult}位大人，${guest.child}位小孩/${rooms.length}房`}</p>
      </div>
      <div className=" divide-y">
        {roomResult?.map((roomData, index) => (
          <RoomAllocation key={index} roomData={roomData} />
        ))}
      </div>
    </div>
  );
};

export default RoomPage;
