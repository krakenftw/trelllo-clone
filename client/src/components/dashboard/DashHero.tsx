import { CircleHelp } from "lucide-react";
import TaskView from "./TaskView";
import Toolbar from "./Toolbar";
import InfoCards from "./InfoCards";

export default function DashHero({ user, showModal, setShowModal }: any) {
  return (
    <div className="min-h-full w-full p-4 bg-gray-200 flex gap-4 flex-col">
      <div className="flex flex-col gap-4">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-4xl font-semibold">
            Good morning, {user.name.split(" ")[0]}!
          </h1>
          <span className="flex gap-1 items-center justify-center">
            Help & feedback <CircleHelp size={15} />
          </span>
        </div>
        <div>
          <InfoCards />
        </div>
        <div>
          <Toolbar setShowModal={setShowModal} />
        </div>
      </div>
      <div>
        <TaskView showModal={showModal} setShowModal={setShowModal} />
      </div>
    </div>
  );
}
