
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User, UserPlus, UserMinus, AlertTriangle, FileText, Euro } from "lucide-react";
import { Plot, usePlots } from "@/hooks/usePlots";
import { useEntityRedFlags } from "@/hooks/useEntityRedFlags";
import { PlotDetailsDialog } from "./PlotDetailsDialog";
import { PlotAssignmentDialog } from "./PlotAssignmentDialog";
import { PlotUnassignDialog } from "./PlotUnassignDialog";
import { useTranslation } from "@/hooks/useTranslation";

interface PlotCardProps {
  plot: Plot;
  onPlotUpdated?: () => void;
}

export const PlotCard = ({ plot, onPlotUpdated }: PlotCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);
  const [isGeneratingContract, setIsGeneratingContract] = useState(false);
  const { hasActiveRedFlags } = useEntityRedFlags('plot', plot.id);
  const { generateRentalContractPDF } = usePlots();
  const { t } = useTranslation();

  console.log('Plot data in card:', plot); // Debug log

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "ocupada":
        return t('statusOccupied');
      case "disponible":
        return t('statusAvailable');
      case "mantenimiento":
        return t('statusMaintenance');
      default:
        return status;
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

  const handleGenerateContract = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGeneratingContract) return;
    
    setIsGeneratingContract(true);
    try {
      await generateRentalContractPDF(plot);
    } finally {
      setIsGeneratingContract(false);
    }
  };

  return (
    <>
      <Card className={cardClassName} onClick={handleCardClick}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>{t('plotNumber')}{plot.number}</span>
              {hasActiveRedFlags && (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </CardTitle>
            <Badge className={getStatusColor(plot.status)}>
              {getStatusText(plot.status)}
            </Badge>
          </div>
          
          {/* Mostrar información con etiquetas claras */}
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">{t('size')}:</span> {plot.size}m²
            </div>
            <div>
              <span className="font-medium text-gray-700">{t('location')}:</span> {plot.location}
            </div>
          </div>
          
          {/* Mostrar el precio prominentemente */}
          <div className="flex items-center space-x-2 text-sm font-semibold text-green-600">
            <Euro className="h-4 w-4" />
            <span>{t('price')}: {plot.price ? `${plot.price}€/any` : 'No definit'}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {plot.member?.first_name ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span><strong>{t('assignedTo')}:</strong> {plot.member.first_name} {plot.member.last_name || ''}</span>
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
                  {t('unassign')}
                </Button>
              </div>
              
              {/* Botón para generar contrato */}
              <div className="flex justify-center">
                <Button
                  size="sm"
                  onClick={handleGenerateContract}
                  disabled={isGeneratingContract}
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  {isGeneratingContract ? t('generatingContract') : t('generateContract')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 italic">
                {t('plotAvailable')}
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
                {t('assign')}
              </Button>
            </div>
          )}
          
          {plot.assigned_date && (
            <div className="text-xs text-gray-500">
              {t('assignedDate')}: {new Date(plot.assigned_date).toLocaleDateString()}
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
        assignedMemberName={`${plot.member?.first_name || ''} ${plot.member?.last_name || ''}`}
      />
    </>
  );
};
