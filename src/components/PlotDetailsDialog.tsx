
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MapPin, User, Calendar, FileText, Plus, Trash2, AlertTriangle, Edit } from "lucide-react";
import { Plot, usePlots } from "@/hooks/usePlots";
import { useIncidents, PlotIncident } from "@/hooks/useIncidents";
import { IncidentCreationDialog } from "./IncidentCreationDialog";
import { RedFlagDialog } from "./RedFlagDialog";
import { RedFlagsList } from "./RedFlagsList";
import { PlotEditDialog } from "./PlotEditDialog";

interface PlotDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plot: Plot | null;
  onRedFlagChange?: () => void;
}

export const PlotDetailsDialog = ({ isOpen, onClose, plot, onRedFlagChange }: PlotDetailsDialogProps) => {
  const [plotIncidents, setPlotIncidents] = useState<PlotIncident[]>([]);
  const [isIncidentDialogOpen, setIsIncidentDialogOpen] = useState(false);
  const [isRedFlagDialogOpen, setIsRedFlagDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { getPlotIncidents, addPlotIncident, deleteIncident } = useIncidents();
  const { deletePlot } = usePlots();

  useEffect(() => {
    if (plot && isOpen) {
      loadPlotIncidents();
    }
  }, [plot, isOpen]);

  const loadPlotIncidents = async () => {
    if (!plot) return;
    
    const { data } = await getPlotIncidents(plot.id);
    setPlotIncidents(data);
  };

  const handleIncidentCreated = async (incidentId: string) => {
    if (!plot) return;
    
    await addPlotIncident(plot.id, incidentId);
    loadPlotIncidents();
    setIsIncidentDialogOpen(false);
  };

  const handleDeleteIncident = async (incidentId: string) => {
    const result = await deleteIncident(incidentId);
    if (result.error === null) {
      loadPlotIncidents();
    }
  };

  const handleRedFlagCreated = () => {
    setIsRedFlagDialogOpen(false);
    onRedFlagChange?.();
  };

  const handleRedFlagChanged = () => {
    onRedFlagChange?.();
  };

  const handlePlotUpdated = () => {
    setIsEditDialogOpen(false);
    onRedFlagChange?.(); // This will trigger a refresh of the plot data
  };

  const handleDeletePlot = async () => {
    if (!plot) return;
    
    const result = await deletePlot(plot.id);
    if (result.error === null) {
      onClose();
      onRedFlagChange?.(); // This will refresh the plots list
    }
  };

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

  if (!plot) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Parcel·la #{plot.number}</span>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(plot.status)}>
                  {plot.status}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="h-4 w-4" />
                  <span>Editar</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar parcel·la?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Aquesta acció no es pot desfer. La parcel·la #{plot.number} serà eliminada permanentment, 
                        així com totes les seves incidències i assignacions.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel·lar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeletePlot}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Eliminar Parcel·la
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </DialogTitle>
            <DialogDescription>
              Informació detallada de la parcel·la
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span><strong>Ubicació:</strong> {plot.location}</span>
                </div>
                <div className="text-sm">
                  <strong>Mida:</strong> {plot.size}
                </div>
              </div>
              
              <div className="space-y-2">
                {plot.member?.first_name ? (
                  <>
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span><strong>Assignada a:</strong> {plot.member.first_name} {plot.member.last_name || ''}</span>
                    </div>
                    {plot.assigned_date && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span><strong>Des de:</strong> {new Date(plot.assigned_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    Parcel·la disponible per assignar
                  </div>
                )}
              </div>
            </div>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informació</TabsTrigger>
                <TabsTrigger value="incidents" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Incidències ({plotIncidents.length})</span>
                </TabsTrigger>
                <TabsTrigger value="redflags" className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Red Flags</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detalls de la Parcel·la</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Número:</strong> {plot.number}</div>
                    <div><strong>Mida:</strong> {plot.size}</div>
                    <div><strong>Ubicació:</strong> {plot.location}</div>
                    <div><strong>Estat:</strong> {plot.status}</div>
                    <div><strong>Creada:</strong> {new Date(plot.created_at).toLocaleDateString()}</div>
                    <div><strong>Actualitzada:</strong> {new Date(plot.updated_at).toLocaleDateString()}</div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="incidents" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Incidències</h3>
                  <Button 
                    size="sm"
                    onClick={() => setIsIncidentDialogOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Nova Incidència</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  {plotIncidents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No hi ha incidències registrades per aquesta parcel·la
                    </div>
                  ) : (
                    plotIncidents.map((incident) => (
                      <Card key={incident.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{incident.incident.title}</CardTitle>
                              <CardDescription>
                                {new Date(incident.created_at).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar incidència?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Aquesta acció no es pot desfer. La incidència serà eliminada permanentment.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel·lar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteIncident(incident.incident.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardHeader>
                        {incident.incident.description && (
                          <CardContent>
                            <p className="text-sm text-gray-600">{incident.incident.description}</p>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="redflags" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Red Flags</h3>
                  <Button 
                    size="sm"
                    onClick={() => setIsRedFlagDialogOpen(true)}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Nova Red Flag</span>
                  </Button>
                </div>

                <RedFlagsList 
                  entityType="plot" 
                  entityId={plot.id} 
                  onRedFlagChange={handleRedFlagChanged}
                />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <IncidentCreationDialog
        isOpen={isIncidentDialogOpen}
        onClose={() => setIsIncidentDialogOpen(false)}
        onIncidentCreated={handleIncidentCreated}
      />

      <RedFlagDialog
        isOpen={isRedFlagDialogOpen}
        onClose={() => setIsRedFlagDialogOpen(false)}
        onRedFlagCreated={handleRedFlagCreated}
        entityType="plot"
        entityId={plot.id}
        entityName={`Parcel·la #${plot.number}`}
      />

      <PlotEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        plot={plot}
        onPlotUpdated={handlePlotUpdated}
      />
    </>
  );
};
