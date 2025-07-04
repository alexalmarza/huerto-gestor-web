
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
  const { assignPlot } = usePlots();

  // Filter active members who don't have a plot assigned
  const availableMembers = members.filter(member => 
    member.is_active && !member.assigned_plot
  );

  const handleAssign = async () => {
    if (!selectedMemberId || isAssigning) return;

    setIsAssigning(true);
    console.log('Starting plot assignment...'); // Debug log
    
    try {
      const result = await assignPlot(plotId, { assigned_member_id: selectedMemberId });
      
      if (result.error === null) {
        console.log('Plot assignment successful, clearing form and closing dialog'); // Debug log
        setSelectedMemberId("");
        onClose();
      } else {
        console.error('Plot assignment failed:', result.error); // Debug log
      }
    } catch (error) {
      console.error('Plot assignment error:', error);
    } finally {
      setIsAssigning(false);
    }
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
          <DialogTitle>Assignar Parcel·la #{plotNumber}</DialogTitle>
          <DialogDescription>
            Selecciona un soci actiu per assignar aquesta parcel·la
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="member">Soci</Label>
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId} disabled={isAssigning}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un soci" />
              </SelectTrigger>
              <SelectContent>
                {availableMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} - {member.dni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableMembers.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No hi ha socis actius disponibles (sense parcel·la assignada)
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isAssigning}>
              Cancel·lar
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={!selectedMemberId || isAssigning || availableMembers.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isAssigning ? "Assignant..." : "Assignar Parcel·la"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
