import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

interface SettingsDialogProps {
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  considerTraffic: boolean;
  onConsiderTrafficChange: (enabled: boolean) => void;
}

export const SettingsDialog = ({ 
  darkMode, 
  onDarkModeChange, 
  considerTraffic, 
  onConsiderTrafficChange 
}: SettingsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Icon name="Settings" size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Настройки</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Тёмная тема</Label>
              <p className="text-sm text-muted-foreground">
                Переключить между светлой и тёмной темой
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={onDarkModeChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="traffic">Учитывать пробки</Label>
              <p className="text-sm text-muted-foreground">
                Добавить дополнительное время на пробки
              </p>
            </div>
            <Switch
              id="traffic"
              checked={considerTraffic}
              onCheckedChange={onConsiderTrafficChange}
            />
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="font-semibold mb-2">О приложении</h3>
            <p className="text-sm text-muted-foreground">
              Focus Time v1.0 — Планируйте время и успевайте больше!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
