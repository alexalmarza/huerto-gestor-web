
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
import { Plus, Search, User, Phone, Mail, MapPin, Calendar } from "lucide-react";

export const MembersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Mock data - en producción esto vendría de Supabase
  const members = [
    {
      id: 1,
      name: "Juan Pérez González",
      dni: "12345678A",
      email: "juan.perez@email.com",
      phone: "666123456",
      address: "Calle Mayor, 123, Madrid",
      joinDate: "2024-01-15",
      plotNumber: "001",
      paymentStatus: "al día"
    },
    {
      id: 2,
      name: "María García López",
      dni: "87654321B",
      email: "maria.garcia@email.com",
      phone: "666789012",
      address: "Avenida Principal, 45, Madrid",
      joinDate: "2024-02-10",
      plotNumber: "003",
      paymentStatus: "pendiente"
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      dni: "11223344C",
      email: "carlos.rodriguez@email.com",
      phone: "666345678",
      address: "Plaza España, 8, Madrid",
      joinDate: "2023-11-20",
      plotNumber: "015",
      paymentStatus: "al día"
    },
    // Más socios...
  ];

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "al día":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-orange-100 text-orange-800";
      case "vencido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.plotNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Socios</h2>
          <p className="text-gray-600">Administra los socios de la asociación</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Socio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Socio</DialogTitle>
              <DialogDescription>
                Completa la información personal del nuevo socio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" placeholder="Juan Pérez González" />
                </div>
                <div>
                  <Label htmlFor="dni">DNI/NIE</Label>
                  <Input id="dni" placeholder="12345678A" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="juan@email.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="666123456" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" placeholder="Calle Mayor, 123, Madrid" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Crear Socio
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
            placeholder="Buscar por nombre, DNI, email o parcela..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>DNI: {member.dni}</CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getPaymentStatusColor(member.paymentStatus)}>
                    {member.paymentStatus}
                  </Badge>
                  <Badge variant="outline">
                    Parcela #{member.plotNumber}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{member.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Socio desde: {member.joinDate}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Perfil
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Pagos
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
