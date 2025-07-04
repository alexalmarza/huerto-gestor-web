
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
  const [reason, setReason] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);
  
  const { deactivateMember } = useMembers();

  const handleDeactivate = async () => {
    if (!reason.trim()) return;

    setIsDeactivating(true);
    const result = await deactivateMember(memberId, { 
      deactivation_reason: reason.trim()
    });
    
    if (result.error === null) {
      setReason("");
      onClose();
    }
    setIsDeactivating(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desactivar Soci</DialogTitle>
          <DialogDescription>
            Estàs segur de voler desactivar a {memberName}?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Motiu de la baixa</Label>
            <Textarea
              id="reason"
              placeholder="Descriu el motiu de la desactivació..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel·lar
            </Button>
            <Button 
              onClick={handleDeactivate}
              disabled={!reason.trim() || isDeactivating}
              variant="destructive"
            >
              {isDeactivating ? "Desactivant..." : "Desactivar Soci"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
