"use client";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Loader from "../Loading";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
} from "@dnd-kit/core";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { TaskList } from "./TaskList";
import NewTaskModal from "./NewTaskModal";
import { ITask, Task } from "./Task";

TimeAgo.addDefaultLocale(en);

export interface IBoardData {
  _id?: string;
  userId?: string;
  todo: ITask[];
  in_progress: ITask[];
  under_review: ITask[];
  completed: ITask[];
  updatedAt?: string;
  createdAt?: string;
  __v?: number;
}

type ColumnName = "todo" | "in_progress" | "under_review" | "completed";
export type Columns = Record<ColumnName, string>;

const columns: Record<ColumnName, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  under_review: "Under Review",
  completed: "Completed",
};

export default function TaskView({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [currTask, setCurrTask] = useState<any>(null);
  const { toast } = useToast();
  const [boardData, setBoardData] = useState<IBoardData | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<string>("todo");
  const [isDragComplete, setIsDragComplete] = useState<boolean>(false);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/task`,
          { withCredentials: true },
        );
        console.log(response.data);
        if (response.status === 200) {
          setBoardData({
            todo: response.data.boardData.todo || [],
            in_progress: response.data.boardData.in_progress || [],
            under_review: response.data.boardData.under_review || [],
            completed: response.data.boardData.completed || [],
          });
        }
      } catch (err) {
        console.error(err);
        toast({ title: "Error fetching tasks" });
      }
    };

    fetchBoardData();
  }, []);

  const handleUpdateTasks = useCallback(async () => {
    if (!boardData) return;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/task/update`,
        {
          tasks: {
            todo: boardData.todo,
            in_progress: boardData.in_progress,
            under_review: boardData.under_review,
            completed: boardData.completed,
          },
        },
        { withCredentials: true },
      );
    } catch (err) {
      console.error(err);
      toast({ title: "Error updating tasks" });
    }
  }, [boardData]);

  // const handleDeleteTask = async (id: string) => {
  //   console.log("id, ", id);
  //   try {
  //     await axios.post(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}/task/delete`,
  //       {
  //         taskId: id,
  //       },
  //       { withCredentials: true },
  //     );
  //
  //     toast({ title: "Task Deleted" });
  //     setBoardData((prev: any) => {
  //       const updatedBoardData = { ...prev };
  //       for (const key in updatedBoardData) {
  //         updatedBoardData[key] = updatedBoardData[key].filter(
  //           (task: any) => task._id !== id,
  //         );
  //       }
  //       return updatedBoardData;
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     toast({ title: "Error Deleting tasks" });
  //   }
  // };

  useEffect(() => {
    if (isDragComplete) {
      handleUpdateTasks();
      setIsDragComplete(false);
    }
  }, [isDragComplete, handleUpdateTasks]);

  if (!boardData) return <Loader />;

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setCurrTask(active.id);
    const task = Object.values(boardData)
      .flat()
      .find((t: any) => t._id === active.id);
    setCurrTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "task";
    const isOverATask = over.data.current?.type === "task";

    if (!isActiveATask) return;

    const sourceColumn = Object.keys(columns).find(
      (column) =>
        boardData?.[column as ColumnName]?.find(
          (task: ITask) => task._id === activeId,
        ),
    );
    const destinationColumn = isOverATask
      ? Object.keys(columns).find(
          (column) =>
            boardData?.[column as ColumnName]?.find(
              (task: ITask) => task._id === overId,
            ),
        )
      : overId;

    if (!sourceColumn || !destinationColumn) return;

    setBoardData((prev: any) => {
      const prevColumns = { ...prev };

      const activeTask = prevColumns[sourceColumn].find(
        (t: any) => t._id === activeId,
      );
      prevColumns[sourceColumn] = prevColumns[sourceColumn].filter(
        (t: any) => t._id !== activeId,
      );

      if (isOverATask) {
        const overTaskIndex = prevColumns[destinationColumn].findIndex(
          (t: any) => t._id === overId,
        );
        prevColumns[destinationColumn].splice(overTaskIndex, 0, activeTask);
      } else {
        prevColumns[destinationColumn].push(activeTask);
      }

      return prevColumns;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      const sourceColumn = Object.keys(columns).find(
        (column) =>
          boardData?.[column as ColumnName]?.find(
            (task: ITask) => task._id === activeId,
          ),
      );

      let destinationColumn = Object.keys(columns).find(
        (column) =>
          boardData?.[column as ColumnName]?.find(
            (task: ITask) => task._id === overId,
          ),
      );
      if (!destinationColumn) {
        destinationColumn = overId as keyof typeof columns;
      }

      if (sourceColumn && destinationColumn) {
        setBoardData((prev: any) => {
          const sourceItems = [...prev[sourceColumn]];
          const destinationItems = [...prev[destinationColumn]];

          const [movedItem] = sourceItems.splice(
            sourceItems.findIndex((task: any) => task._id === activeId),
            1,
          );

          if (destinationColumn === sourceColumn) {
            sourceItems.splice(
              destinationItems.findIndex((task: any) => task._id === overId),
              0,
              movedItem,
            );
            return {
              ...prev,
              [sourceColumn]: sourceItems,
            };
          } else {
            destinationItems.push(movedItem);
            return {
              ...prev,
              [sourceColumn]: sourceItems,
              [destinationColumn]: destinationItems,
            };
          }
        });
      }
    }
    setIsDragComplete(true);
  };

  return (
    <div>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex w-full bg-white rounded-lg">
          <div className="flex w-full space-x-4">
            {Object.keys(columns).map((key: string) => (
              <TaskList
                setShowModal={setShowModal}
                key={key}
                columns={columns}
                boardData={boardData}
                name={key}
                setDefaultStatus={setDefaultStatus}
              />
            ))}
          </div>
        </div>
        <DragOverlay>{currTask ? <Task task={currTask} /> : null}</DragOverlay>
      </DndContext>
      <NewTaskModal
        setBoardData={setBoardData}
        defaultStatus={defaultStatus}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
}
