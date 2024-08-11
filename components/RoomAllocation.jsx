import React from "react";
import CustomInputNumber from "./CustomInputNumber";
import { getTotalAssignedGuests } from "../utils/helperFunc";
import { ADULT, CHILD } from "./constants/constants";

function RoomAllocation({ guest, rooms, onChange, allocations }) {
  const handleOnChange = (roomIndex, type, value) => {
    onChange(roomIndex, type, value);
  };

  const getDisabledStatus = (roomIndex, type) => {
    const totalAssigned = getTotalAssignedGuests(allocations, type);
    const remainingAssignableGuests =
      guest[type] - totalAssigned + allocations[roomIndex][type];

    if (type === CHILD && allocations[roomIndex][ADULT] === 0) {
      return true;
    }
    return remainingAssignableGuests === 0;
  };

  return (
    <div className="w-full divide-y">
      {allocations.map((alloc, index) => {
        // totalAssignedAdults and totalAssignedChildren mean all adults and childs who already be assigned to specific room
        const totalAssignedAdults = getTotalAssignedGuests(allocations, ADULT);
        const totalAssignedChildren = getTotalAssignedGuests(
          allocations,
          CHILD
        );
        // assignedAdult and assignedChildren mean adult and child assigned to current room
        const assignedAdult = guest.adult - totalAssignedAdults + alloc.adult;
        const assignedChildren =
          guest.child - totalAssignedChildren + alloc.child;
        return (
          <div key={index} className="w-full flex flex-row ">
            <div className="w-full flex flex-col">
              <div className="w-full flex flex-row items-center justify-between my-4">
                <div>
                  <p>{`房間：${alloc[ADULT] + alloc[CHILD]}人`}</p>
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
                    handleOnChange(index, ADULT, parseInt(e.target.value))
                  }
                  onBlur={(e) => console.log(e.target.name, e.target.value)}
                  disabled={getDisabledStatus(index, ADULT)}
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
                      handleOnChange(index, CHILD, parseInt(e.target.value))
                    }
                    onBlur={(e) => console.log(e.target.name, e.target.value)}
                    disabled={getDisabledStatus(index, CHILD)}
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
