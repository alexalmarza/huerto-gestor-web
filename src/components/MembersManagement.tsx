
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Plus, Search, User, Phone, Mail, MapPin, Calendar, UserMinus, UserCheck } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { MemberDeactivationDialog } from "./MemberDeactivationDialog";

export const MembersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deactivationDialog, setDeactivationDialog] = useState<{
    isOpen: boolean;
    memberId: string;
    memberName: string;
  }>({ isOpen: false, memberId: "", memberName: "" });
  const [newMember, setNewMember] = useState({
    name: "",
    dni: "",
    email: "",
    phone: "",
    address: ""
  });

  const { members, loading, createMember, activateMember } = useMembers();

  const activeMembers = members.filter(member => member.is_active);
  const inactiveMembers = members.filter(member => !member.is_active);

  const handleCreateMember = async () => {
    if (!newMember.name || !newMember.dni || !newMember.email) {
      return;
    }

    const memberData = {
      ...newMember,
      phone: newMember.phone || undefined,
      address: newMember.address || undefined
    };

    const result = await createMember(memberData);
    if (result.error === null) {
      setNewMember({ name: "", dni: "", email: "", phone: "", address: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleActivateMember = async (memberId: string) => {
    await activateMember(memberId);
  };

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

  const filteredActiveMembers = activeMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInactiveMembers = inactiveMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const MemberCard = ({ member, isActive }: { member: any; isActive: boolean }) => (
    <Card key={member.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>{member.name}</span>
              {!isActive && <Badge variant="secondary">Inactivo</Badge>}
            </CardTitle>
            <CardDescription>DNI: {member.dni}</CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {isActive && (
              <Badge className={getPaymentStatusColor(member.payment_status)}>
                {member.payment_status}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{member.email}</span>
          </div>
          {member.phone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{member.phone}</span>
            </div>
          )}
          {member.address && (
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{member.address}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>
              {isActive ? 
                `Socio desde: ${new Date(member.join_date).toLocaleDateString()}` :
                `Baja: ${new Date(member.deactivation_date).toLocaleDateString()}`
              }
            </span>
          </div>
          {!isActive && member.deactivation_reasons && (
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-700">Motivos de baja:</div>
              <div className="flex flex-wrap gap-1">
                {member.deactivation_reasons.map((reason: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {!isActive && member.deactivation_reason && !member.deactivation_reasons && (
            <div className="text-sm text-gray-600 italic">
              <strong>Motivo:</strong> {member.deactivation_reason}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            Ver Perfil
          </Button>
          {isActive ? (
            <>
              <Button variant="outline" size="sm" className="flex-1">
                Editar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => setDeactivationDialog({
                  isOpen: true,
                  memberId: member.id,
                  memberName: member.name
                })}
              >
                <UserMinus className="h-4 w-4 mr-1" />
                Desactivar
              </Button>
            </>
          ) : (
            <Button 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleActivateMember(member.id)}
            >
              <UserCheck className="h-4 w-4 mr-1" />
              Reactivar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
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
                  <Input 
                    id="name" 
                    placeholder="Juan Pérez González" 
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="dni">DNI/NIE</Label>
                  <Input 
                    id="dni" 
                    placeholder="12345678A" 
                    value={newMember.dni}
                    onChange={(e) => setNewMember(prev => ({ ...prev, dni: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="juan@email.com" 
                    value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input 
                    id="phone" 
                    placeholder="666123456" 
                    value={newMember.phone}
                    onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input 
                  id="address" 
                  placeholder="Calle Mayor, 123, Madrid" 
                  value={newMember.address}
                  onChange={(e) => setNewMember(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateMember}
                >
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
            placeholder="Buscar por nombre, DNI o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Socios Activos ({activeMembers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center space-x-2">
            <UserMinus className="h-4 w-4" />
            <span>Socios Inactivos ({inactiveMembers.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredActiveMembers.map((member) => (
              <MemberCard key={member.id} member={member} isActive={true} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredInactiveMembers.map((member) => (
              <MemberCard key={member.id} member={member} isActive={false} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <MemberDeactivationDialog
        isOpen={deactivationDialog.isOpen}
        onClose={() => setDeactivationDialog({ isOpen: false, memberId: "", memberName: "" })}
        memberId={deactivationDialog.memberId}
        memberName={deactivationDialog.memberName}
      />
    </div>
  );
};
