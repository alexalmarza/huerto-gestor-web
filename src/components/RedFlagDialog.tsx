
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { useRedFlags } from "@/hooks/useRedFlags";

interface RedFlagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRedFlagCreated: () => void;
  entityType: 'member' | 'plot';
  entityId: string;
  entityName: string;
}

const reasonOptions = [
  { value: 'impago', label: 'Impagament de quotes' },
  { value: 'incumplimiento', label: 'Incompliment de normes' },
  { value: 'mantenimiento', label: 'Problemes de manteniment' },
  { value: 'conflicto', label: 'Conflicte amb altres socis' },
  { value: 'daño_propiedad', label: 'Dany a la propietat' },
  { value: 'otro', label: 'Altre motiu' }
];

export const RedFlagDialog = ({ isOpen, onClose, onRedFlagCreated, entityType, entityId, entityName }: RedFlagDialogProps) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createRedFlag } = useRedFlags();

  const handleSubmit = async () => {
    if (!reason) {
      return;
    }

    setIsSubmitting(true);
    
    const result = await createRedFlag({
      entity_type: entityType,
      entity_id: entityId,
      reason,
      description: description || undefined
    });

    if (result.error === null) {
      setReason('');
      setDescription('');
      onRedFlagCreated();
      onClose();
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Marcar Alerta</span>
          </DialogTitle>
          <DialogDescription>
            Marcant una alerta per: <strong>{entityName}</strong> ({entityType === 'member' ? 'Soci' : 'Parcel·la'})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Motiu de l'Alerta</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un motiu" />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descripció (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descriu el problema o situació..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel·lar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!reason || isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Creant...' : 'Crear Alerta'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
