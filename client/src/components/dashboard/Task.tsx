"use client";
import TimeAgo from "javascript-time-ago";
import { bgColorClass } from "@/lib/colorizerPriority";
import { Clock3, X } from "lucide-react";

export function Task({ task, handleDeleteTask }: any) {
  const timeAgo = new TimeAgo("en-US");
  return (
    <div className="bg-gray-200 group relative cursor-pointer rounded-lg p-2 text-md gap-2 border border-border flex flex-col items-start justify-center">
      <div>{task.title}</div>
      {task.description && <div className="text-xs">{task.description}</div>}
      {task.priority && (
        <div
          className={`text-xs px-2 py-1 ${bgColorClass(
            task.priority,
          )}   text-white rounded-lg`}
        >
          {task.priority}
        </div>
      )}
      {task.deadline && (
        <div className="flex items-center gap-1 text-xs">
          <Clock3 className="w-5" />
          {new Date(task.deadline).toLocaleDateString()}
        </div>
      )}
      <div className="text-xs text-gray-500">
        {timeAgo.format(new Date(task.createdAt))}
      </div>
      <div
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          console.log("Delete button clicked for task:", task._id);
          handleDeleteTask(task._id);
        }}
        className="z-[10000] absolute hidden group-hover:block top-2 right-2"
      >
        <X className="size-4 z-[2000]" />
      </div>
    </div>
  );
}
