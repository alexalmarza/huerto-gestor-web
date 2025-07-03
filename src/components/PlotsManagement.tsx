
import { useState } from "react";
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
import { Plus, Search, MapPin, User, Calendar } from "lucide-react";

export const PlotsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Mock data - en producción esto vendría de Supabase
  const plots = [
    {
      id: 1,
      number: "001",
      size: "25m²",
      status: "ocupada",
      member: "Juan Pérez",
      assignedDate: "2024-01-15",
      location: "Sector A"
    },
    {
      id: 2,
      number: "002",
      size: "30m²",
      status: "disponible",
      member: null,
      assignedDate: null,
      location: "Sector A"
    },
    {
      id: 3,
      number: "003",
      size: "25m²",
      status: "ocupada",
      member: "María García",
      assignedDate: "2024-02-10",
      location: "Sector A"
    },
    // Más parcelas...
  ];

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
    plot.member?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plot.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Parcelas</h2>
          <p className="text-gray-600">Administra las 260 parcelas del huerto comunitario</p>
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
                  <Input id="number" placeholder="001" />
                </div>
                <div>
                  <Label htmlFor="size">Tamaño</Label>
                  <Input id="size" placeholder="25m²" />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Ubicación/Sector</Label>
                <Input id="location" placeholder="Sector A" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
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
          <Card key={plot.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Parcela #{plot.number}</CardTitle>
                  <CardDescription className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{plot.location}</span>
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(plot.status)}>
                  {plot.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <strong>Tamaño:</strong> {plot.size}
              </div>
              
              {plot.member ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{plot.member}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Asignada: {plot.assignedDate}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  Parcela disponible para asignación
                </div>
              )}
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Detalles
                </Button>
                {plot.status === "disponible" ? (
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    Asignar
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
    </div>
  );
};
