
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Calendar, AlertTriangle } from "lucide-react";
import { Plot } from "@/hooks/usePlots";
import { useEntityRedFlags } from "@/hooks/useEntityRedFlags";
import { PlotDetailsDialog } from "./PlotDetailsDialog";

interface PlotCardProps {
  plot: Plot;
}

export const PlotCard = ({ plot }: PlotCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
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
    ? "bg-red-50 border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
    : "hover:shadow-md transition-shadow cursor-pointer";

  return (
    <>
      <Card 
        className={cardClassName}
        onClick={() => setIsDetailsOpen(true)}
      >
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
          <CardDescription>{plot.location}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <strong>Tamaño:</strong> {plot.size}
          </div>
          {plot.member?.name ? (
            <>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span><strong>Asignada a:</strong> {plot.member.name}</span>
              </div>
              {plot.assigned_date && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span><strong>Desde:</strong> {new Date(plot.assigned_date).toLocaleDateString()}</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-gray-500 italic">
              Disponible para asignación
            </div>
          )}
        </CardContent>
      </Card>

      <PlotDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        plot={plot}
      />
    </>
  );
};
