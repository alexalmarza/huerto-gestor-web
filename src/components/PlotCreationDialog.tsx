
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus } from "lucide-react";
import { usePlots } from "@/hooks/usePlots";

interface PlotCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlotCreationDialog = ({ isOpen, onClose }: PlotCreationDialogProps) => {
  const { createPlot } = usePlots();
  const [number, setNumber] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [status, setStatus] = useState('disponible');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!number.trim() || !location.trim() || !size.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createPlot({
        number: number.trim(),
        location: location.trim(),
        size: size.trim()
      });

      if (result.error === null) {
        // Reset form
        setNumber('');
        setLocation('');
        setSize('');
        setStatus('disponible');
        onClose();
      }
    } catch (error) {
      console.error('Error creating plot:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNumber('');
      setLocation('');
      setSize('');
      setStatus('disponible');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Nova Parcel·la</span>
          </DialogTitle>
          <DialogDescription>
            Crear una nova parcel·la a l'hort
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="number">Número de Parcel·la *</Label>
            <Input
              id="number"
              placeholder="Ex: 001, A-12, etc."
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="location">Ubicació *</Label>
            <Input
              id="location"
              placeholder="Ex: Sector A, Zona Nord, etc."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="size">Mida *</Label>
            <Input
              id="size"
              placeholder="Ex: 25m², 50m², etc."
              value={size}
              onChange={(e) => setSize(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="status">Estat Inicial</Label>
            <Select value={status} onValueChange={setStatus} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="mantenimiento">Manteniment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel·lar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!number.trim() || !location.trim() || !size.trim() || isSubmitting}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creant...' : 'Crear Parcel·la'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
