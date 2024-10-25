import Bento from "@/components/ui/Bento";
import { Vortex } from "@/components/ui/vortex";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      />
      <Bento />
    </div>
  );
}
