import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import HotZones from "@/components/HotZones";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
        <HotZones/>

      </main>
    </div>
  );
}


function handleSearch(playerName: string) {
    console.log(playerName)
}