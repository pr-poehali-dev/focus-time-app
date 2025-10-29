import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { EditTaskDialog } from "@/components/EditTaskDialog";
import { HistoryDialog } from "@/components/HistoryDialog";
import { SettingsDialog } from "@/components/SettingsDialog";

interface Task {
  id: number;
  title: string;
  duration: number;
  completed: boolean;
}

interface HistoryItem {
  id: number;
  destination: string;
  arrivalTime: string;
  transport: string;
  departureTime: string;
  date: string;
}

const Index = () => {
  const [destination, setDestination] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [transport, setTransport] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [considerTraffic, setConsiderTraffic] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Подъем", duration: 10, completed: false },
    { id: 2, title: "Завтрак", duration: 15, completed: false },
    { id: 3, title: "Одеться", duration: 10, completed: false },
    { id: 4, title: "Сборы (ключи, телефон, кошелек)", duration: 5, completed: false },
  ]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const destinations = [
    "Работа - ул. Ленина, 45",
    "Дом - пр. Мира, 123",
    "Спортзал - ул. Победы, 67",
    "Магазин - ТЦ Европа",
  ];

  const transportOptions = [
    { value: "car", label: "Автомобиль", icon: "Car", time: 25 },
    { value: "public", label: "Общественный транспорт", icon: "Bus", time: 45 },
    { value: "walk", label: "Пешком", icon: "PersonStanding", time: 60 },
    { value: "taxi", label: "Такси", icon: "Truck", time: 20 },
    { value: "bike", label: "Велосипед", icon: "Bike", time: 35 },
  ];

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (title: string, duration: number) => {
    const newTask: Task = {
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      title,
      duration,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    toast.success("Задача добавлена");
  };

  const editTask = (id: number, title: string, duration: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title, duration } : task
    ));
    toast.success("Задача обновлена");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Задача удалена");
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const getTotalPreparationTime = () => {
    return tasks.reduce((sum, task) => sum + task.duration, 0);
  };

  const getTravelTime = () => {
    const selected = transportOptions.find(t => t.value === transport);
    let baseTime = selected ? selected.time : 0;
    if (considerTraffic && transport === "car") {
      baseTime = Math.round(baseTime * 1.3);
    }
    return baseTime;
  };

  const calculateDepartureTime = () => {
    if (!arrivalTime || !transport || !destination) {
      toast.error("Заполните все поля: пункт назначения, время и транспорт");
      return;
    }

    const totalMinutes = getTotalPreparationTime() + getTravelTime();
    const [hours, minutes] = arrivalTime.split(":").map(Number);
    const arrivalDate = new Date();
    arrivalDate.setHours(hours, minutes, 0);
    
    const departureDate = new Date(arrivalDate.getTime() - totalMinutes * 60000);
    const departureTime = departureDate.toLocaleTimeString("ru-RU", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });

    const wakeUpTime = new Date(departureDate.getTime() - 5 * 60000);
    const wakeUpTimeStr = wakeUpTime.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const newHistoryItem: HistoryItem = {
      id: Date.now(),
      destination,
      arrivalTime,
      transport: transportOptions.find(t => t.value === transport)?.label || transport,
      departureTime,
      date: new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
    };
    setHistory([newHistoryItem, ...history.slice(0, 9)]);

    toast.success(`Вам нужно встать в ${wakeUpTimeStr}`, {
      description: `Выход из дома: ${departureTime}. Сборы: ${getTotalPreparationTime()} мин, Путь: ${getTravelTime()} мин`,
      duration: 5000,
    });
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setDestination(item.destination);
    setArrivalTime(item.arrivalTime);
    const transportOption = transportOptions.find(t => t.label === item.transport);
    if (transportOption) {
      setTransport(transportOption.value);
    }
    toast.info("Данные загружены из истории");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
              <Icon name="Clock" size={48} className="text-primary relative" />
            </div>
            <h1 className="text-4xl font-bold ml-4 text-primary">Focus Time</h1>
          </div>
          <div className="flex gap-2">
            <HistoryDialog history={history} onSelect={handleHistorySelect} />
            <SettingsDialog
              darkMode={darkMode}
              onDarkModeChange={setDarkMode}
              considerTraffic={considerTraffic}
              onConsiderTrafficChange={setConsiderTraffic}
            />
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="MapPin" size={20} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Куда и когда</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="destination" className="text-sm font-medium mb-2 block">
                  Пункт назначения
                </Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger id="destination" className="h-12">
                    <SelectValue placeholder="Выберите из истории" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest, idx) => (
                      <SelectItem key={idx} value={dest}>
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={16} />
                          {dest}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="arrival" className="text-sm font-medium mb-2 block">
                  Время прибытия
                </Label>
                <Input
                  id="arrival"
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div>
                <Label htmlFor="transport" className="text-sm font-medium mb-2 block">
                  Как добраться
                </Label>
                <Select value={transport} onValueChange={setTransport}>
                  <SelectTrigger id="transport" className="h-12">
                    <SelectValue placeholder="Выберите транспорт" />
                  </SelectTrigger>
                  <SelectContent>
                    {transportOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon name={option.icon as any} size={16} />
                          <span>{option.label}</span>
                          <span className="text-muted-foreground text-sm ml-auto">
                            ~{option.time} мин
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="ListChecks" size={20} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Сколько времени на сборы</h2>
            </div>

            <div className="space-y-3 mb-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`flex-1 cursor-pointer ${
                      task.completed ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </label>
                  <div className="flex items-center gap-1 text-sm font-medium text-primary">
                    <Icon name="Clock" size={14} />
                    {task.duration} мин
                  </div>
                </div>
              ))}
            </div>

            <AddTaskDialog onAddTask={addTask} />

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-muted-foreground">Время на сборы:</span>
                <span className="font-semibold text-lg text-primary">
                  {getTotalPreparationTime()} минут
                </span>
              </div>
              {transport && (
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">
                    Время в пути:
                    {considerTraffic && transport === "car" && (
                      <span className="text-xs ml-1">(с пробками)</span>
                    )}
                  </span>
                  <span className="font-semibold text-lg text-primary">
                    {getTravelTime()} минут
                  </span>
                </div>
              )}
            </div>
          </Card>

          <Button
            onClick={calculateDepartureTime}
            className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            <Icon name="Calculator" size={20} className="mr-2" />
            Рассчитать время подъёма
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Планируйте время — успевайте больше 🚀</p>
        </div>
      </div>

      <EditTaskDialog
        task={editingTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={editTask}
        onDelete={deleteTask}
      />
    </div>
  );
};

export default Index;
