
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
          <DialogTitle>Nova Incidència</DialogTitle>
          <DialogDescription>
            Crea una nova incidència que podràs associar a socis o parcel·les
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Títol</Label>
            <Input
              id="title"
              placeholder="Descriu breument la incidència..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Descripció (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Informació addicional sobre la incidència..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel·lar
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!title.trim() || isCreating}
            >
              {isCreating ? "Creant..." : "Crear Incidència"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
