"use client";
import TimeAgo from "javascript-time-ago";
import { bgColorClass } from "@/lib/colorizerPriority";
import { Clock3 } from "lucide-react";

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "under_review" | "completed";
  priority?: "low" | "medium" | "high";
  deadline?: Date | string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export function Task({ task }: { task: ITask }) {
  const timeAgo = new TimeAgo("en-US");
  return (
    <div className="bg-gray-200 cursor-pointer rounded-lg p-2 text-md gap-2 border border-border flex flex-col items-start justify-center w-full">
      <span className=" text-start w-full break-words">{task.title}</span>
      {task.description && (
        <div className="text-xs text-start break-words">{task.description}</div>
      )}
      {task.priority && (
        <div
          className={`text-xs px-2 py-1 ${bgColorClass(
            task.priority,
          )} text-white rounded-lg`}
        >
          {task.priority}
        </div>
      )}
      {task.deadline && (
        <div className="flex items-center gap-1 text-xs w-full">
          <Clock3 className="w-5 flex-shrink-0" />
          <span className="break-words">
            {new Date(task.deadline).toLocaleDateString()}
          </span>
        </div>
      )}
      <div className="text-xs text-gray-500">
        {timeAgo.format(new Date(task.createdAt))}
      </div>
    </div>
  );
}
