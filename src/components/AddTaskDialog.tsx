import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

interface AddTaskDialogProps {
  onAddTask: (title: string, duration: number) => void;
}

export const AddTaskDialog = ({ onAddTask }: AddTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (title && duration && Number(duration) > 0) {
      onAddTask(title, Number(duration));
      setTitle("");
      setDuration("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить задачу
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новая задача</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="task-title">Название задачи</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например, выгулять собаку"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="task-duration">Время выполнения (минуты)</Label>
            <Input
              id="task-duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="15"
              className="mt-2"
              min="1"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Добавить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
