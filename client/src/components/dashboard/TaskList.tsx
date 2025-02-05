//@ts-nocheck
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChartNoAxesColumnIncreasing, Plus } from "lucide-react";
import { SortableItem } from "../dnd/SortableItem";
import { Draggable } from "../dnd/Draggable";
import { ITask, Task } from "./Task";
import { Button } from "../ui/button";
import { Columns, IBoardData } from "./TaskView";

interface TaskListProps {
  columns: Columns;
  boardData: IBoardData;
  name: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setDefaultStatus: React.Dispatch<React.SetStateAction<string>>;
}

export function TaskList({
  columns,
  boardData,
  name,
  setShowModal,
  setDefaultStatus,
}: TaskListProps) {
  const { setNodeRef } = useDroppable({
    id: name,
  });
  return (
    <div
      className="overflow-x-hidden w-1/4 overflow-scroll p-4 bg-gray-100 rounded-lg shadow"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="flex items-center w-full justify-between mb-4">
        <span className="font-semibold">{columns[name]}</span>
        <ChartNoAxesColumnIncreasing className="rotate-90" />
      </div>
      <div
        ref={setNodeRef}
        className="flex flex-col w-full space-y-2 min-h-[50px]"
      >
        <SortableContext
          //@ts-ignore
          items={boardData[name]}
          strategy={verticalListSortingStrategy}
        >
          {boardData[name].map((task: ITask) => (
            <SortableItem id={task._id} key={task._id}>
              <Draggable id={task._id}>
                <Task key={task._id} task={task} />
              </Draggable>
            </SortableItem>
          ))}
        </SortableContext>
        {boardData[name].length === 0 && (
          <div className="h-20 w-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500">
            Drop tasks here
          </div>
        )}
      </div>
      <div className="my-4">
        <Button
          variant={"secondary"}
          className="px-4 py-4 w-full flex items-center justify-between"
          onClick={() => {
            setDefaultStatus(name);
            setShowModal(true);
          }}
        >
          <span>Add new</span>
          <Plus className="m-0 p-0 w-5" />
        </Button>
      </div>
    </div>
  );
}
