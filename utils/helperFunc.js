import { ADULT, CHILD } from "../components/constants/constants";

export const getDefaultRoomAllocation = (guest, rooms) => {
  const totalAdults = guest.adult;
  const totalChildren = guest.child;
  // at least adult in guests
  if (totalAdults === 0) {
    return rooms.map(() => ({ adult: 0, child: 0, price: 0 }));
  }
  let bestAllocation = null;
  let bestPrice = Number.MAX_SAFE_INTEGER;

  function tryAllocation(
    adultLeft, // audlt can be assigned
    childLeft, // child can be assigned
    roomIndex, // curr room index
    currentAllocation, // curr allocation
    totalPrice // total price
  ) {
    if (adultLeft === 0 && childLeft === 0) {
      if (totalPrice < bestPrice) {
        bestPrice = totalPrice;
        bestAllocation = [...currentAllocation];
      }
      return;
    }
    // if the rooms are used up but there are still guests, it's not a valid allocation
    if (roomIndex === rooms.length) {
      return;
    }
    const room = rooms[roomIndex];
    // try to assign different number of adult to room(at least one)
    for (
      let adults = 1;
      adults <= Math.min(room.capacity, adultLeft);
      adults++
    ) {
      // minus audlt, becuase each room must includ one adult, get the min from room.capacity and childLeft
      let maxChildren = Math.min(room.capacity - adults, childLeft);
      for (let children = 0; children <= maxChildren; children++) {
        let price =
          room.roomPrice +
          adults * room.adultPrice +
          children * room.childPrice;
        currentAllocation[roomIndex] = {
          adult: adults,
          child: children,
          price,
        };
        tryAllocation(
          adultLeft - adults,
          childLeft - children,
          roomIndex + 1,
          currentAllocation,
          totalPrice + price
        );
      }
    }
    currentAllocation[roomIndex] = { adult: 0, child: 0, price: 0 };
    tryAllocation(
      adultLeft,
      childLeft,
      roomIndex + 1,
      currentAllocation,
      totalPrice
    );
  }

  // init
  let initialAllocation = rooms.map(() => ({ adult: 0, child: 0, price: 0 }));
  tryAllocation(totalAdults, totalChildren, 0, initialAllocation, 0);

  return bestAllocation || initialAllocation;
};

// get total assigned guests
export const getTotalAssignedGuests = (allocations, type) => {
  let total = 0;
  for (let i = 0; i < allocations.length; i++) {
    total += allocations[i][type];
  }
  return total;
};
// get remain guests
export const getRemainingGuests = (allocations, guest) => {
  const totalAssignedAdults = getTotalAssignedGuests(allocations, ADULT);
  const totalAssignedChildren = getTotalAssignedGuests(allocations, CHILD);

  return {
    adult: guest.adult - totalAssignedAdults,
    child: guest.child - totalAssignedChildren,
  };
};
