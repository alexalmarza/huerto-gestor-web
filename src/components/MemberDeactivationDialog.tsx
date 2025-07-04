
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMembers } from "@/hooks/useMembers";

interface MemberDeactivationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
}

export const MemberDeactivationDialog = ({ isOpen, onClose, memberId, memberName }: MemberDeactivationDialogProps) => {
  const [deactivationReason, setDeactivationReason] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);
  
  const { deactivateMember } = useMembers();

  const handleDeactivate = async () => {
    if (!deactivationReason.trim()) return;

    setIsDeactivating(true);
    const result = await deactivateMember(memberId, { 
      deactivation_reason: deactivationReason.trim() 
    });
    
    if (result.error === null) {
      setDeactivationReason("");
      onClose();
    }
    setIsDeactivating(false);
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
            <Label htmlFor="reason">Motivo de la baja</Label>
            <Textarea
              id="reason"
              placeholder="Explica el motivo de la desactivación..."
              value={deactivationReason}
              onChange={(e) => setDeactivationReason(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleDeactivate}
              disabled={!deactivationReason.trim() || isDeactivating}
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
