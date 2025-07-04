
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMembers } from "@/hooks/useMembers";
import { usePlots } from "@/hooks/usePlots";

interface PlotAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plotId: string;
  plotNumber: string;
}

export const PlotAssignmentDialog = ({ isOpen, onClose, plotId, plotNumber }: PlotAssignmentDialogProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  
  const { members } = useMembers();
  const { plots, assignPlot } = usePlots();

  // Filter active members who don't have a plot assigned
  const availableMembers = members.filter(member => 
    member.is_active && 
    !plots.some(plot => plot.assigned_member_id === member.id)
  );

  const handleAssign = async () => {
    if (!selectedMemberId) return;

    setIsAssigning(true);
    console.log('Starting plot assignment...'); // Debug log
    
    const result = await assignPlot(plotId, { assigned_member_id: selectedMemberId });
    
    if (result.error === null) {
      console.log('Plot assignment successful, closing dialog'); // Debug log
      setSelectedMemberId("");
      onClose();
    } else {
      console.error('Plot assignment failed:', result.error); // Debug log
    }
    setIsAssigning(false);
  };

  const handleClose = () => {
    if (!isAssigning) {
      setSelectedMemberId("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar Parcela #{plotNumber}</DialogTitle>
          <DialogDescription>
            Selecciona un socio activo para asignar esta parcela
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="member">Socio</Label>
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId} disabled={isAssigning}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un socio" />
              </SelectTrigger>
              <SelectContent>
                {availableMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} - {member.dni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isAssigning}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={!selectedMemberId || isAssigning}
              className="bg-green-600 hover:bg-green-700"
            >
              {isAssigning ? "Asignando..." : "Asignar Parcela"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
