
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plot, usePlots } from "@/hooks/usePlots";
import { useTranslation } from "@/hooks/useTranslation";

interface PlotEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plot: Plot;
  onPlotUpdated: () => void;
}

export const PlotEditDialog = ({ isOpen, onClose, plot, onPlotUpdated }: PlotEditDialogProps) => {
  const [number, setNumber] = useState("");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"ocupada" | "disponible" | "mantenimiento">("disponible");
  const [price, setPrice] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { t } = useTranslation();
  
  const { updatePlot } = usePlots();

  useEffect(() => {
    if (plot && isOpen) {
      setNumber(plot.number);
      setSize(plot.size);
      setLocation(plot.location);
      setStatus(plot.status as "ocupada" | "disponible" | "mantenimiento");
      setPrice(plot.price?.toString() || "120");
    }
  }, [plot, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!number.trim() || !size.trim() || !location.trim()) {
      return;
    }

    setIsUpdating(true);
    
    try {
      const result = await updatePlot(plot.id, {
        number: number.trim(),
        size: size.trim(),
        location: location.trim(),
        status,
        price: price ? parseFloat(price) : 120
      });
      
      if (result.error === null) {
        onPlotUpdated();
      }
    } catch (error) {
      console.error('Error updating plot:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (!isUpdating) {
      // Reset form
      setNumber(plot.number);
      setSize(plot.size);
      setLocation(plot.location);
      setStatus(plot.status as "ocupada" | "disponible" | "mantenimiento");
      setPrice(plot.price?.toString() || "120");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editPlotTitle')}{plot.number}</DialogTitle>
          <DialogDescription>
            {t('modifyPlotData')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="number">{t('plotNumberLabel')}</Label>
            <Input
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={t('plotNumberPlaceholder')}
              disabled={isUpdating}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="size">{t('size')}</Label>
            <Input
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder={t('sizePlaceholder')}
              disabled={isUpdating}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="location">{t('location')}</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('locationPlaceholder')}
              disabled={isUpdating}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">{t('pricePerYear')}</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={t('pricePlaceholder')}
              disabled={isUpdating}
            />
          </div>
          
          <div>
            <Label htmlFor="status">{t('status')}</Label>
            <Select value={status} onValueChange={(value: "ocupada" | "disponible" | "mantenimiento") => setStatus(value)} disabled={isUpdating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">{t('statusAvailable')}</SelectItem>
                <SelectItem value="ocupada">{t('statusOccupied')}</SelectItem>
                <SelectItem value="mantenimiento">{t('statusMaintenance')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUpdating}>
              {t('cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isUpdating || !number.trim() || !size.trim() || !location.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? t('updating') : t('updatePlotBtn')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
