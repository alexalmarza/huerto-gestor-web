
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useIncidents } from "@/hooks/useIncidents";

interface IncidentCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onIncidentCreated: (incidentId: string) => void;
}

export const IncidentCreationDialog = ({ isOpen, onClose, onIncidentCreated }: IncidentCreationDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const { createIncident } = useIncidents();

  const handleCreate = async () => {
    if (!title.trim()) return;

    setIsCreating(true);
    const result = await createIncident({ 
      title: title.trim(),
      description: description.trim() || undefined
    });
    
    if (result.error === null && result.data) {
      onIncidentCreated(result.data.id);
      setTitle("");
      setDescription("");
      onClose();
    }
    setIsCreating(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Incidencia</DialogTitle>
          <DialogDescription>
            Crea una nueva incidencia que podrás asociar a socios o parcelas
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Describe brevemente la incidencia..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Información adicional sobre la incidencia..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!title.trim() || isCreating}
            >
              {isCreating ? "Creando..." : "Crear Incidencia"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
