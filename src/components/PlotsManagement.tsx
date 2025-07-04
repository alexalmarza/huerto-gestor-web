import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Plus, Search, MapPin, User, Calendar, UserX, Edit, Trash2 } from "lucide-react";
import { usePlots, Plot } from "@/hooks/usePlots";
import { useMembers } from "@/hooks/useMembers";
import { PlotAssignmentDialog } from "./PlotAssignmentDialog";
import { PlotDetailsDialog } from "./PlotDetailsDialog";

export const PlotsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [assignmentDialog, setAssignmentDialog] = useState<{
    isOpen: boolean;
    plotId: string;
    plotNumber: string;
  }>({ isOpen: false, plotId: "", plotNumber: "" });
  const [newPlot, setNewPlot] = useState({
    number: "",
    size: "",
    location: ""
  });
  const [forceUpdate, setForceUpdate] = useState(0);

  const { plots, loading, createPlot, unassignPlot, updatePlot, deletePlot } = usePlots();
  const { members } = useMembers();

  // Force re-render when plots change
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
    console.log('Plots updated, forcing re-render:', plots.length);
  }, [plots]);

  const handleCreatePlot = async () => {
    if (!newPlot.number || !newPlot.size || !newPlot.location) {
      return;
    }

    const result = await createPlot(newPlot);
    if (result.error === null) {
      setNewPlot({ number: "", size: "", location: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleUpdatePlot = async () => {
    if (!editingPlot || !editingPlot.number || !editingPlot.size || !editingPlot.location) {
      return;
    }

    const result = await updatePlot(editingPlot.id, {
      number: editingPlot.number,
      size: editingPlot.size,
      location: editingPlot.location
    });
    
    if (result.error === null) {
      setEditingPlot(null);
    }
  };

  const handleDeletePlot = async (plotId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta parcela?")) {
      await deletePlot(plotId);
    }
  };

  const handleUnassignPlot = async (plotId: string) => {
    await unassignPlot(plotId);
  };

  const handleAssignmentComplete = () => {
    console.log('Assignment completed, closing dialog and forcing update');
    setAssignmentDialog({ isOpen: false, plotId: "", plotNumber: "" });
    // Force immediate re-render
    setForceUpdate(prev => prev + 1);
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

  const filteredPlots = plots.filter(plot =>
    plot.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plot.member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plot.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" key={forceUpdate}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Parcelas</h2>
          <p className="text-gray-600">Administra las parcelas del huerto comunitario</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Parcela
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Parcela</DialogTitle>
              <DialogDescription>
                Completa la información para crear una nueva parcela
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="number">Número de Parcela</Label>
                  <Input 
                    id="number" 
                    placeholder="001" 
                    value={newPlot.number}
                    onChange={(e) => setNewPlot(prev => ({ ...prev, number: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="size">Tamaño</Label>
                  <Input 
                    id="size" 
                    placeholder="25m²" 
                    value={newPlot.size}
                    onChange={(e) => setNewPlot(prev => ({ ...prev, size: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Ubicación/Sector</Label>
                <Input 
                  id="location" 
                  placeholder="Sector A" 
                  value={newPlot.location}
                  onChange={(e) => setNewPlot(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleCreatePlot}
                >
                  Crear Parcela
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por número, socio o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlots.map((plot) => (
          <Card key={`${plot.id}-${plot.status}-${forceUpdate}`} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Parcela #{plot.number}</CardTitle>
                  <CardDescription className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{plot.location}</span>
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getStatusColor(plot.status)}>
                    {plot.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingPlot(plot)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePlot(plot.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <strong>Tamaño:</strong> {plot.size}
              </div>
              
              {plot.member?.name ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{plot.member.name}</span>
                  </div>
                  {plot.assigned_date && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Asignada: {new Date(plot.assigned_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  Parcela disponible para asignación
                </div>
              )}
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedPlot(plot)}
                >
                  Ver Detalles
                </Button>
                {plot.status === "disponible" ? (
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => setAssignmentDialog({
                      isOpen: true,
                      plotId: plot.id,
                      plotNumber: plot.number
                    })}
                  >
                    Asignar
                  </Button>
                ) : plot.status === "ocupada" ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleUnassignPlot(plot.id)}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Liberar
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="flex-1">
                    Gestionar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PlotAssignmentDialog
        isOpen={assignmentDialog.isOpen}
        onClose={handleAssignmentComplete}
        plotId={assignmentDialog.plotId}
        plotNumber={assignmentDialog.plotNumber}
      />

      <PlotDetailsDialog
        isOpen={selectedPlot !== null}
        onClose={() => setSelectedPlot(null)}
        plot={selectedPlot}
      />

      {editingPlot && (
        <Dialog open={true} onOpenChange={() => setEditingPlot(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Parcela #{editingPlot.number}</DialogTitle>
              <DialogDescription>
                Modifica la información de la parcela
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-number">Número de Parcela</Label>
                  <Input 
                    id="edit-number" 
                    value={editingPlot.number}
                    onChange={(e) => setEditingPlot(prev => prev ? { ...prev, number: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-size">Tamaño</Label>
                  <Input 
                    id="edit-size" 
                    value={editingPlot.size}
                    onChange={(e) => setEditingPlot(prev => prev ? { ...prev, size: e.target.value } : null)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-location">Ubicación/Sector</Label>
                <Input 
                  id="edit-location" 
                  value={editingPlot.location}
                  onChange={(e) => setEditingPlot(prev => prev ? { ...prev, location: e.target.value } : null)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingPlot(null)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleUpdatePlot}
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
