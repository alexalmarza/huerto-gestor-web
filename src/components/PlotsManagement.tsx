
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, MapPin, CheckCircle, Clock, Wrench } from "lucide-react";
import { usePlots } from "@/hooks/usePlots";
import { PlotCard } from "./PlotCard";
import { PlotCreationDialog } from "./PlotCreationDialog";

export const PlotsManagement = () => {
  const { plots, loading, refetch } = usePlots();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreationDialogOpen, setIsCreationDialogOpen] = useState(false);

  // Calculate statistics
  const totalPlots = plots.length;
  const occupiedPlots = plots.filter(plot => plot.status === 'ocupada').length;
  const availablePlots = plots.filter(plot => plot.status === 'disponible').length;
  const maintenancePlots = plots.filter(plot => plot.status === 'mantenimiento').length;

  // Filter plots based on search and filters
  const filteredPlots = plots.filter(plot => {
    const matchesSearch = plot.number.includes(searchTerm) ||
                         plot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plot.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (plot.member?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || plot.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handlePlotUpdated = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parcelas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlots}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{occupiedPlots}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{availablePlots}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mantenimiento</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{maintenancePlots}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Parcelas</CardTitle>
              <CardDescription>
                Administra las parcelas del huerto urbano
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreationDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Parcela
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por número, ubicación, tamaño o socio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="ocupada">Ocupadas</SelectItem>
                <SelectItem value="disponible">Disponibles</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Plots Grid */}
          {filteredPlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "No se encontraron parcelas que coincidan con los filtros"
                : "No hay parcelas registradas"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlots.map((plot) => (
                <PlotCard 
                  key={plot.id} 
                  plot={plot} 
                  onPlotUpdated={handlePlotUpdated}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PlotCreationDialog
        isOpen={isCreationDialogOpen}
        onClose={() => setIsCreationDialogOpen(false)}
      />
    </div>
  );
};
