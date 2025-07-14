import { LiveblocksRoom } from "@/lib/liveblocks-room";
import ControlPanel from "./ControlPanel";
import Navbar from "@/components/Navbar";


export default function ControlPage() {
  return (
    <LiveblocksRoom>
      <Navbar />
      <ControlPanel />
    </LiveblocksRoom>
  );
}
