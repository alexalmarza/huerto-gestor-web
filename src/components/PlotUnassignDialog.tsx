
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { usePlots } from "@/hooks/usePlots";

interface PlotUnassignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plotId: string;
  plotNumber: string;
  assignedMemberName: string;
}

export const PlotUnassignDialog = ({ isOpen, onClose, plotId, plotNumber, assignedMemberName }: PlotUnassignDialogProps) => {
  const [isUnassigning, setIsUnassigning] = useState(false);
  const { unassignPlot } = usePlots();

  const handleUnassign = async () => {
    if (isUnassigning) return;

    setIsUnassigning(true);
    console.log('Starting plot unassignment...'); // Debug log
    
    try {
      const result = await unassignPlot(plotId);
      
      if (result.error === null) {
        console.log('Plot unassignment successful, closing dialog'); // Debug log
        onClose();
      } else {
        console.error('Plot unassignment failed:', result.error); // Debug log
      }
    } catch (error) {
      console.error('Plot unassignment error:', error);
    } finally {
      setIsUnassigning(false);
    }
  };

  const handleClose = () => {
    if (!isUnassigning) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Desasignar Parcela #{plotNumber}</span>
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres desasignar esta parcela de <strong>{assignedMemberName}</strong>?
            <br />
            La parcela quedará disponible para asignar a otro socio.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose} disabled={isUnassigning}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUnassign}
            disabled={isUnassigning}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isUnassigning ? "Desasignando..." : "Desasignar Parcela"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
