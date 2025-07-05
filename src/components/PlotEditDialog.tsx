
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plot, usePlots } from "@/hooks/usePlots";

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
          <DialogTitle>Editar Parcel·la #{plot.number}</DialogTitle>
          <DialogDescription>
            Modifica les dades de la parcel·la
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="number">Número de parcel·la</Label>
            <Input
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Ex: 001"
              disabled={isUpdating}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="size">Mida</Label>
            <Input
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Ex: 25m²"
              disabled={isUpdating}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="location">Matriu</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Matriu"
              disabled={isUpdating}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Preu (€/any)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="120.00"
              disabled={isUpdating}
            />
          </div>
          
          <div>
            <Label htmlFor="status">Estat</Label>
            <Select value={status} onValueChange={(value: "ocupada" | "disponible" | "mantenimiento") => setStatus(value)} disabled={isUpdating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="ocupada">Ocupada</SelectItem>
                <SelectItem value="mantenimiento">Manteniment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUpdating}>
              Cancel·lar
            </Button>
            <Button 
              type="submit" 
              disabled={isUpdating || !number.trim() || !size.trim() || !location.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? "Actualitzant..." : "Actualitzar Parcel·la"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
