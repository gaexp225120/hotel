import React, { useState, useEffect } from "react";
import CustomInputNumber from "./CustomInputNumber";
import { getDefaultRoomAllocation } from "@/utils/getDefaultRoomAllocation";

function RoomAllocation({ guest, rooms, onChange }) {
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    const initialAllocations = getDefaultRoomAllocation(guest, rooms);
    setAllocations(initialAllocations);
    onChange(initialAllocations);
  }, [guest, rooms]);

  const getTotalAssigned = (type) => {
    // console.log(allocations);
    let total = 0;

    for (let i = 0; i < allocations.length; i++) {
      total += allocations[i][type];
    }
    // console.log(type, total);
    return total;
  };

  const handleAllocationChange = (roomIndex, type, value) => {
    const newAllocations = allocations.map((alloc, index) => {
      if (index === roomIndex) {
        return { ...alloc, [type]: value };
      }
      return alloc;
    });
    setAllocations(newAllocations);
    onChange(newAllocations);
  };

  const getDisabledStatus = (roomIndex, type) => {
    const totalAssigned = getTotalAssigned(type);
    const remaining =
      type === "adult"
        ? guest.adult - totalAssigned
        : guest.child - totalAssigned;

    const assigned =
      type === "adult"
        ? guest.adult - totalAssigned + allocations[roomIndex].adult
        : guest.child - totalAssigned + allocations[roomIndex].child;

    const roomCapacity = rooms[roomIndex].capacity;
    console.log("remaining", type, remaining);
    console.log("assigned", type, assigned);
    // Check if the input should be disabled

    if (
      type === "child" &&
      assigned === 0 &&
      allocations[roomIndex].adult <= 0
    ) {
      return true;
    } else if (assigned > 0) {
      console.log("its false");
      return false;
    } else if (assigned === 0) {
      return true;
    }
  };

  useEffect(() => {
    // const totalAssignedAdults = getTotalAssigned("adult");
    // const totalAssignedChildren = getTotalAssigned("child");
    // const remainingAdults = guest.adult - totalAssignedAdults;
    // const remainingChildren = guest.child - totalAssignedChildren;
    // console.log("totalAssignedAdults", totalAssignedAdults);
    // console.log("totalAssignedChildren", totalAssignedChildren);
    // console.log("alloc", allocations);
    // console.log("remainingAdults", remainingAdults);
    // console.log("remainingChildren", remainingChildren);
  }, []);

  return (
    <div className="w-full divide-y">
      {allocations.map((alloc, index) => {
        // console.log("alloc", alloc, alloc.price);
        const totalAssignedAdults = getTotalAssigned("adult");
        const totalAssignedChildren = getTotalAssigned("child");
        // console.log("totalAssignedAdults", totalAssignedAdults);
        // console.log("totalAssignedChildren", totalAssignedChildren);

        // remainingAdults and remainingChildren are used to check how many audlt or child this room can be added
        const assignedAdult = guest.adult - totalAssignedAdults + alloc.adult;
        const assignedChildren =
          guest.child - totalAssignedChildren + alloc.child;

        return (
          <div key={index} className="w-full flex flex-row ">
            {/* <h3>Room {index + 1}</h3> */}
            <div className="w-full flex flex-col">
              <div className="w-full flex flex-row items-center justify-between my-4">
                <div>
                  <p className="text-[16px]">大人</p>
                  <p className="text-gray-400 text-[12px]">年齡 20+</p>
                </div>
                <CustomInputNumber
                  name={`adult-${index}`}
                  value={alloc.adult}
                  adultNumber={alloc.adult}
                  min={0}
                  max={Math.min(rooms[index].capacity, assignedAdult)}
                  step={1}
                  onChange={(e) =>
                    handleAllocationChange(
                      index,
                      "adult",
                      parseInt(e.target.value)
                    )
                  }
                  onBlur={(e) => console.log(e.target.name, e.target.value)}
                  disabled={getDisabledStatus(index, "adult")}
                />
              </div>
              <div>
                <div className="w-full flex flex-row items-center justify-between my-4">
                  <p>小孩</p>
                  <CustomInputNumber
                    name={`child-${index}`}
                    value={alloc.child}
                    adultNumber={alloc.adult}
                    min={0}
                    max={Math.min(rooms[index].capacity, assignedChildren)}
                    step={1}
                    onChange={(e) =>
                      handleAllocationChange(
                        index,
                        "child",
                        parseInt(e.target.value)
                      )
                    }
                    onBlur={(e) => console.log(e.target.name, e.target.value)}
                    disabled={getDisabledStatus(index, "child")}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RoomAllocation;
