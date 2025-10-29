import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";

interface HistoryItem {
  id: number;
  destination: string;
  arrivalTime: string;
  transport: string;
  departureTime: string;
  date: string;
}

interface HistoryDialogProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistoryDialog = ({ history, onSelect }: HistoryDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Icon name="History" size={20} />
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {history.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>История поездок</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Clock" size={48} className="mx-auto mb-2 opacity-50" />
              <p>История пуста</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} className="text-primary mt-1" />
                      <span className="font-medium">{item.destination}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      {item.arrivalTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="ArrowRight" size={14} />
                      Выход в {item.departureTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
