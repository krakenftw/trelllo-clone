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
} from "@dnd-kit/core";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { TaskList } from "./TaskList";
import NewTaskModal from "./NewTaskModal";

TimeAgo.addDefaultLocale(en);

export default function TaskView() {
  const [currTask, setCurrTask] = useState<any>(null);
  const { toast } = useToast();
  const [boardData, setBoardData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<string>("todo");
  const [isDragComplete, setIsDragComplete] = useState(false);

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

  const handleDeleteTask = async (id: string) => {
    console.log("id, ", id);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/task/delete`,
        {
          taskId: id,
        },
        { withCredentials: true },
      );

      toast({ title: "Task Deleted" });
      setBoardData((prev: any) => {
        const updatedBoardData = { ...prev };
        for (const key in updatedBoardData) {
          updatedBoardData[key] = updatedBoardData[key].filter(
            (task: any) => task._id !== id,
          );
        }
        return updatedBoardData;
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Error Deleting tasks" });
    }
  };

  useEffect(() => {
    if (isDragComplete) {
      handleUpdateTasks();
      setIsDragComplete(false);
    }
  }, [isDragComplete, handleUpdateTasks]);

  const columns: Record<string, string> = {
    todo: "To Do",
    in_progress: "In Progress",
    under_review: "Under Review",
    completed: "Completed",
  };

  if (!boardData) return <Loader />;

  const handleDragStart = (event: DragStartEvent) => {
    setCurrTask(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const sourceColumn = Object.keys(columns).find((column) =>
        boardData[column].find((task: any) => task._id === active.id),
      );
      const destinationColumn = Object.keys(columns).find((column) =>
        boardData[column].find((task: any) => task._id === over.id),
      );

      if (
        sourceColumn &&
        destinationColumn &&
        sourceColumn !== destinationColumn
      ) {
        const sourceIndex = boardData[sourceColumn].findIndex(
          (task: any) => task._id === active.id,
        );
        const destinationIndex = boardData[destinationColumn].findIndex(
          (task: any) => task._id === over.id,
        );

        const sourceItems = [...boardData[sourceColumn]];
        const destinationItems = [...boardData[destinationColumn]];

        const [movedItem] = sourceItems.splice(sourceIndex, 1);
        destinationItems.splice(destinationIndex, 0, movedItem);

        setBoardData((prev: any) => ({
          ...prev,
          [sourceColumn]: sourceItems,
          [destinationColumn]: destinationItems,
        }));
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      const sourceColumn = Object.keys(columns).find((column) =>
        boardData[column].find((task: any) => task._id === activeId),
      );
      let destinationColumn = Object.keys(columns).find((column) =>
        boardData[column].find((task: any) => task._id === overId),
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
        <div className="flex min-h-screen w-screen p-4">
          <div className="flex w-full space-x-4">
            {Object.keys(columns).map((key) => (
              <TaskList
                setShowModal={setShowModal}
                key={key}
                columns={columns}
                boardData={boardData}
                name={key}
                setDefaultStatus={setDefaultStatus}
                handleDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </div>
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
