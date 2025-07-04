
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";

interface MemberDeactivationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
}

export const MemberDeactivationDialog = ({ isOpen, onClose, memberId, memberName }: MemberDeactivationDialogProps) => {
  const [currentReason, setCurrentReason] = useState("");
  const [reasons, setReasons] = useState<string[]>([]);
  const [isDeactivating, setIsDeactivating] = useState(false);
  
  const { deactivateMember } = useMembers();

  const addReason = () => {
    if (currentReason.trim() && !reasons.includes(currentReason.trim())) {
      setReasons(prev => [...prev, currentReason.trim()]);
      setCurrentReason("");
    }
  };

  const removeReason = (reasonToRemove: string) => {
    setReasons(prev => prev.filter(reason => reason !== reasonToRemove));
  };

  const handleDeactivate = async () => {
    if (reasons.length === 0) return;

    setIsDeactivating(true);
    const result = await deactivateMember(memberId, { 
      deactivation_reasons: reasons
    });
    
    if (result.error === null) {
      setReasons([]);
      setCurrentReason("");
      onClose();
    }
    setIsDeactivating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addReason();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desactivar Socio</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres desactivar a {memberName}?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Motivos de la baja</Label>
            <div className="flex space-x-2">
              <Textarea
                id="reason"
                placeholder="Escribe un motivo y presiona Enter para agregarlo..."
                value={currentReason}
                onChange={(e) => setCurrentReason(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={2}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addReason}
                disabled={!currentReason.trim()}
                variant="outline"
              >
                Agregar
              </Button>
            </div>
          </div>
          
          {reasons.length > 0 && (
            <div>
              <Label>Motivos agregados ({reasons.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {reasons.map((reason, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{reason}</span>
                    <button
                      onClick={() => removeReason(reason)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleDeactivate}
              disabled={reasons.length === 0 || isDeactivating}
              variant="destructive"
            >
              {isDeactivating ? "Desactivando..." : "Desactivar Socio"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
