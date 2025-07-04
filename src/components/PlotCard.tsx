
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User, UserPlus, UserMinus, AlertTriangle } from "lucide-react";
import { Plot, usePlots } from "@/hooks/usePlots";
import { useEntityRedFlags } from "@/hooks/useEntityRedFlags";
import { PlotDetailsDialog } from "./PlotDetailsDialog";
import { PlotAssignmentDialog } from "./PlotAssignmentDialog";
import { PlotUnassignDialog } from "./PlotUnassignDialog";

interface PlotCardProps {
  plot: Plot;
  onPlotUpdated?: () => void;
}

export const PlotCard = ({ plot, onPlotUpdated }: PlotCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);
  const { hasActiveRedFlags } = useEntityRedFlags('plot', plot.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ocupada":
        return "bg-green-100 text-green-800";
      case "disponible":
        return "bg-blue-100 text-blue-800";
      case "mantenimiento":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const cardClassName = hasActiveRedFlags 
    ? "bg-red-50 border-red-200 hover:bg-red-100 transition-colors"
    : "hover:shadow-md transition-shadow";

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsDetailsOpen(true);
  };

  const handleAssignmentClose = () => {
    setIsAssignDialogOpen(false);
    onPlotUpdated?.();
  };

  const handleUnassignClose = () => {
    setIsUnassignDialogOpen(false);
    onPlotUpdated?.();
  };

  return (
    <>
      <Card className={cardClassName} onClick={handleCardClick}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Parcela #{plot.number}</span>
              {hasActiveRedFlags && (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </CardTitle>
            <Badge className={getStatusColor(plot.status)}>
              {plot.status}
            </Badge>
          </div>
          <CardDescription>
            {plot.size} • {plot.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {plot.member?.name ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span><strong>Asignada a:</strong> {plot.member.name}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUnassignDialogOpen(true);
                }}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              >
                <UserMinus className="h-4 w-4 mr-1" />
                Desasignar
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 italic">
                Parcela disponible
              </span>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAssignDialogOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Asignar
              </Button>
            </div>
          )}
          
          {plot.assigned_date && (
            <div className="text-xs text-gray-500">
              Asignada: {new Date(plot.assigned_date).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>

      <PlotDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        plot={plot}
        onRedFlagChange={() => onPlotUpdated?.()}
      />

      <PlotAssignmentDialog
        isOpen={isAssignDialogOpen}
        onClose={handleAssignmentClose}
        plotId={plot.id}
        plotNumber={plot.number}
      />

      <PlotUnassignDialog
        isOpen={isUnassignDialogOpen}
        onClose={handleUnassignClose}
        plotId={plot.id}
        plotNumber={plot.number}
        assignedMemberName={plot.member?.name || ""}
      />
    </>
  );
};
