
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, MapPin, Calendar, AlertTriangle, Edit, Home, UserX, UserCheck } from "lucide-react";
import { Member, useMembers } from "@/hooks/useMembers";
import { useEntityRedFlags } from "@/hooks/useEntityRedFlags";
import { MemberEditDialog } from "./MemberEditDialog";
import { MemberDeactivationDialog } from "./MemberDeactivationDialog";

interface MemberDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  onMemberUpdated?: () => void;
}

export const MemberDetailsDialog = ({ isOpen, onClose, member, onMemberUpdated }: MemberDetailsDialogProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeactivationDialogOpen, setIsDeactivationDialogOpen] = useState(false);
  const { hasActiveRedFlags } = useEntityRedFlags('member', member.id);
  const { activateMember } = useMembers();

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

  const handleMemberUpdated = () => {
    onMemberUpdated?.();
  };

  const handleDeactivationClose = () => {
    setIsDeactivationDialogOpen(false);
    onMemberUpdated?.();
  };

  const handleReactivate = async () => {
    const result = await activateMember(member.id);
    if (result.error === null) {
      handleMemberUpdated();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>{member.name}</span>
              {hasActiveRedFlags && (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </DialogTitle>
            <DialogDescription>
              Información detallada del socio
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Badge className={getPaymentStatusColor(member.payment_status)}>
                  {member.payment_status}
                </Badge>
                <Badge variant={member.is_active ? "default" : "secondary"}>
                  {member.is_active ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setIsEditDialogOpen(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                {member.is_active ? (
                  <Button 
                    onClick={() => setIsDeactivationDialogOpen(true)} 
                    variant="destructive" 
                    size="sm"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Desactivar
                  </Button>
                ) : (
                  <Button 
                    onClick={handleReactivate} 
                    variant="default" 
                    size="sm"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Reactivar
                  </Button>
                )}
              </div>
            </div>

            {/* Member Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">DNI</label>
                  <p className="text-base">{member.dni}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-base">{member.email}</p>
                  </div>
                </div>
                {member.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-base">{member.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de ingreso</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-base">{new Date(member.join_date).toLocaleDateString()}</p>
                  </div>
                </div>
                {member.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dirección</label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-base">{member.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Plot */}
            {member.assigned_plot && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-700">
                  <Home className="h-5 w-5" />
                  <h3 className="font-medium">Parcela Asignada</h3>
                </div>
                <div className="mt-2">
                  <p className="text-green-800">
                    <strong>Parcela #{member.assigned_plot.number}</strong>
                  </p>
                  <p className="text-green-600">
                    Tamaño: {member.assigned_plot.size} - Ubicación: {member.assigned_plot.location}
                  </p>
                </div>
              </div>
            )}

            {/* Deactivation Information */}
            {!member.is_active && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-medium text-red-700 mb-2">Información de Baja</h3>
                {member.deactivation_date && (
                  <p className="text-red-600 text-sm">
                    <strong>Fecha de baja:</strong> {new Date(member.deactivation_date).toLocaleDateString()}
                  </p>
                )}
                {member.deactivation_reason && (
                  <p className="text-red-600 text-sm mt-1">
                    <strong>Motivo:</strong> {member.deactivation_reason}
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <MemberEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        member={member}
        onMemberUpdated={handleMemberUpdated}
      />

      <MemberDeactivationDialog
        isOpen={isDeactivationDialogOpen}
        onClose={handleDeactivationClose}
        memberId={member.id}
        memberName={member.name}
      />
    </>
  );
};
