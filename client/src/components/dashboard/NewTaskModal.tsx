import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "../ui/use-toast";
import axios from "axios";

export default function NewTaskModal(props: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState(props.defaultStatus || "todo");
  const [priority, setPriority] = useState("low");

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new Task</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <Input
              placeholder="Title"
              className="h-10"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Deadline</span>}
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

          <div className="flex items-center justify-between gap-4">
            <span>Status</span>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span>Priority</span>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddTask}>Add Task</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

