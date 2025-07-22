
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { User, Phone, Mail, MapPin, Calendar, AlertTriangle, Edit, Home, UserX, UserCheck, Trash2 } from "lucide-react";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { hasActiveRedFlags } = useEntityRedFlags('member', member.id);
  const { activateMember, deleteMember } = useMembers();

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

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "al día":
        return "Al dia";
      case "pendiente":
        return "Pendent";
      case "vencido":
        return "Vençut";
      default:
        return status;
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

  const handleDelete = async () => {
    const result = await deleteMember(member.id);
    if (result.error === null) {
      setIsDeleteDialogOpen(false);
      onClose();
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
              <span>{member.first_name} {member.last_name || ''}</span>
              {hasActiveRedFlags && (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </DialogTitle>
            <DialogDescription>
              Informació detallada del soci
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Badge className={getPaymentStatusColor(member.payment_status)}>
                  {getPaymentStatusText(member.payment_status)}
                </Badge>
                <Badge variant={member.is_active ? "default" : "secondary"}>
                  {member.is_active ? "Actiu" : "Inactiu"}
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
                <Button 
                  onClick={() => setIsDeleteDialogOpen(true)} 
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
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
                  <label className="text-sm font-medium text-gray-500">Correu electrònic</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-base">{member.email}</p>
                  </div>
                </div>
                {member.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telèfon</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-base">{member.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Data d'ingrés</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-base">{new Date(member.join_date).toLocaleDateString()}</p>
                  </div>
                </div>
                {member.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Adreça</label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-base">{member.address}</p>
                    </div>
                  </div>
                )}
                {(member.postal_code || member.city) && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Localització</label>
                    <p className="text-base">
                      {member.postal_code && member.city 
                        ? `${member.postal_code} ${member.city}`
                        : member.postal_code || member.city
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Plot */}
            {member.assigned_plot && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-700">
                  <Home className="h-5 w-5" />
                  <h3 className="font-medium">Parcel·la Assignada</h3>
                </div>
                <div className="mt-2">
                  <p className="text-green-800">
                    <strong>Parcel·la #{member.assigned_plot.number}</strong>
                  </p>
                  <p className="text-green-600">
                    Mida: {member.assigned_plot.size} - Ubicació: {member.assigned_plot.location}
                  </p>
                </div>
              </div>
            )}

            {/* Deactivation Information */}
            {!member.is_active && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-medium text-red-700 mb-2">Informació de Baixa</h3>
                {member.deactivation_date && (
                  <p className="text-red-600 text-sm">
                    <strong>Data de baixa:</strong> {new Date(member.deactivation_date).toLocaleDateString()}
                  </p>
                )}
                {member.deactivation_reason && (
                  <p className="text-red-600 text-sm mt-1">
                    <strong>Motiu:</strong> {member.deactivation_reason}
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
        memberName={`${member.first_name} ${member.last_name || ''}`}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Socio</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar definitivamente a <strong>{member.first_name} {member.last_name || ''}</strong>? 
              Esta acción no se puede deshacer y eliminará todos los datos del socio de forma permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar Definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
