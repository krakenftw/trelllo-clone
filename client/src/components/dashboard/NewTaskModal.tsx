import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  LoaderIcon,
  Pen,
  PlusIcon,
  ShieldAlert,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { Separator } from "../ui/separator";

export default function NewTaskModal(props: any) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string>(props.defaultStatus || "todo");
  const [priority, setPriority] = useState<string>("low");

  const { toast } = useToast();

  useEffect(() => {
    setStatus(props.defaultStatus);
  }, [props.defaultStatus]);

  const handleAddTask = async () => {
    if (!title || !status) {
      toast({ title: "Title and status are required", variant: "destructive" });
      return;
    }

    try {
      const response = await axios.post(
        ` ${process.env.NEXT_PUBLIC_SERVER_URL}/task/add`,
        { title, description, deadline: date, status, priority },
        { withCredentials: true },
      );
      toast({ title: "Task added" });

      props.setBoardData((prev: any) => {
        const updatedBoardData = { ...prev };
        if (Array.isArray(updatedBoardData[status])) {
          updatedBoardData[status] = [
            ...updatedBoardData[status],
            response.data.task,
          ];
        } else {
          updatedBoardData[status] = [response.data.task];
        }
        return updatedBoardData;
      });

      setTitle("");
      setDescription("");
      setDate(undefined);
      setPriority("low");
    } catch (err) {
      console.error(err);
      toast({ title: "Error adding task", variant: "destructive" });
    }

    props.setShowModal(false);
  };

  return (
    <div>
      <Dialog open={props.showModal} onOpenChange={props.setShowModal}>
        <DialogContent className="flex [&>*]:w-full flex-col gap-4 w-full items-center justify-start">
          <div className="flex  items-center justify-between gap-4">
            <Input
              placeholder="Title"
              className="h-10 p-0 text-3xl border-0"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex w-full items-center justify-between gap-14">
            <div className="flex items-center justify-center gap-4">
              <LoaderIcon size={15} />
              <span className="text-xl">Status</span>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full text-md text-gray-500 border-0">
                <SelectValue placeholder="Not Selected" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-12">
            <div className="flex items-center justify-center gap-4">
              <ShieldAlert size={15} />
              <span className="text-xl">Priority</span>
            </div>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full text-md text-gray-500 border-0">
                <SelectValue placeholder="Not Selected" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-9">
            <div className="flex items-center justify-center gap-4">
              <CalendarIcon size={15} />
              <span className="text-xl">Deadline</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full border-0 text-md justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  {date ? format(date, "PPP") : <span>Not Selected</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center justify-center gap-4">
              <Pen size={15} />
              <span className="text-xl">Description</span>
            </div>
            <Input
              placeholder="Not Selected"
              className="h-10 text-md border-0"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-start gap-4">
            <PlusIcon size={15} />
            <span className="h-10 flex items-center">Add custom property</span>
          </div>

          <Separator />

          <div className="text-gray-400">
            Start writing or drag your own files here.
          </div>

          <Button className="my-4" onClick={handleAddTask}>
            Add Task
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
