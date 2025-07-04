
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus } from "lucide-react";

interface PlotCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlotCreationDialog = ({ isOpen, onClose }: PlotCreationDialogProps) => {
  const [number, setNumber] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [status, setStatus] = useState('disponible');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!number || !location || !size) {
      return;
    }

    setIsSubmitting(true);
    
    // TODO: Implement plot creation logic
    console.log('Creating plot:', { number, location, size, status });
    
    // Reset form
    setNumber('');
    setLocation('');
    setSize('');
    setStatus('disponible');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Nueva Parcela</span>
          </DialogTitle>
          <DialogDescription>
            Crear una nueva parcela en el huerto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="number">Número de Parcela *</Label>
            <Input
              id="number"
              placeholder="Ej: 001, A-12, etc."
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="location">Ubicación *</Label>
            <Input
              id="location"
              placeholder="Ej: Sector A, Zona Norte, etc."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="size">Tamaño *</Label>
            <Input
              id="size"
              placeholder="Ej: 25m², 50m², etc."
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="status">Estado Inicial</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!number || !location || !size || isSubmitting}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creando...' : 'Crear Parcela'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
