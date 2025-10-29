import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Task {
  id: number;
  title: string;
  duration: number;
  completed: boolean;
}

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: number, title: string, duration: number) => void;
  onDelete: (id: number) => void;
}

export const EditTaskDialog = ({ task, open, onOpenChange, onSave, onDelete }: EditTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDuration(task.duration.toString());
    }
  }, [task]);

  const handleSave = () => {
    if (task && title && duration && Number(duration) > 0) {
      onSave(task.id, title, Number(duration));
      onOpenChange(false);
    }
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
      onOpenChange(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать задачу</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="edit-task-title">Название задачи</Label>
            <Input
              id="edit-task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="edit-task-duration">Время выполнения (минуты)</Label>
            <Input
              id="edit-task-duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-2"
              min="1"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Сохранить
            </Button>
            <Button onClick={handleDelete} variant="destructive" className="flex-1">
              Удалить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
