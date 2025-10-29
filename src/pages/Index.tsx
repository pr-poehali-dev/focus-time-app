import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

interface Task {
  id: number;
  title: string;
  duration: number;
  completed: boolean;
}

const Index = () => {
  const [destination, setDestination] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [transport, setTransport] = useState("");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Принять душ", duration: 15, completed: false },
    { id: 2, title: "Позавтракать", duration: 20, completed: false },
    { id: 3, title: "Собрать документы", duration: 10, completed: false },
    { id: 4, title: "Проверить сумку", duration: 5, completed: false },
  ]);

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
  ];

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getTotalPreparationTime = () => {
    return tasks.reduce((sum, task) => sum + task.duration, 0);
  };

  const getTravelTime = () => {
    const selected = transportOptions.find(t => t.value === transport);
    return selected ? selected.time : 0;
  };

  const calculateDepartureTime = () => {
    if (!arrivalTime || !transport) {
      toast.error("Укажите время прибытия и транспорт");
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

    toast.success(`Выходите в ${departureTime}`, {
      description: `Сборы: ${getTotalPreparationTime()} мин, Путь: ${getTravelTime()} мин`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
            <Icon name="Clock" size={48} className="text-primary relative" />
          </div>
          <h1 className="text-4xl font-bold ml-4 text-primary">Focus Time</h1>
        </div>

        <div className="space-y-6">
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
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

          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="ListChecks" size={20} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Сколько времени на сборы</h2>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
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

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-muted-foreground">Время на сборы:</span>
                <span className="font-semibold text-lg text-primary">
                  {getTotalPreparationTime()} минут
                </span>
              </div>
              {transport && (
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-muted-foreground">Время в пути:</span>
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
            Рассчитать время выхода
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Планируйте время — успевайте больше 🚀</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
