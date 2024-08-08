import RoomPage from "@/components/RoomPage";

const guest1 = { adult: 4, child: 2 };
const rooms1 = [
  { roomPrice: 1000, adultPrice: 200, childPrice: 100, capacity: 4 },
  { roomPrice: 0, adultPrice: 500, childPrice: 500, capacity: 4 },
  { roomPrice: 500, adultPrice: 300, childPrice: 200, capacity: 4 },
];

export default function Home() {
  return (
    <main className="h-screen mx-[60px] mt-[60px]">
      <RoomPage guest={guest1} rooms={rooms1} />
    </main>
  );
}
