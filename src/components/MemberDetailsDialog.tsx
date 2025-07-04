
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Phone, Mail, MapPin, Calendar, FileText, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Member } from "@/hooks/useMembers";
import { useIncidents, MemberIncident } from "@/hooks/useIncidents";
import { IncidentCreationDialog } from "./IncidentCreationDialog";
import { RedFlagDialog } from "./RedFlagDialog";
import { RedFlagsList } from "./RedFlagsList";

interface MemberDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onRedFlagChange?: () => void;
}

export const MemberDetailsDialog = ({ isOpen, onClose, member, onRedFlagChange }: MemberDetailsDialogProps) => {
  const [memberIncidents, setMemberIncidents] = useState<MemberIncident[]>([]);
  const [isIncidentDialogOpen, setIsIncidentDialogOpen] = useState(false);
  const [isRedFlagDialogOpen, setIsRedFlagDialogOpen] = useState(false);
  const { getMemberIncidents, addMemberIncident, deleteIncident } = useIncidents();

  useEffect(() => {
    if (member && isOpen) {
      loadMemberIncidents();
    }
  }, [member, isOpen]);

  const loadMemberIncidents = async () => {
    if (!member) return;
    
    const { data } = await getMemberIncidents(member.id);
    setMemberIncidents(data);
  };

  const handleIncidentCreated = async (incidentId: string) => {
    if (!member) return;
    
    await addMemberIncident(member.id, incidentId);
    loadMemberIncidents();
    setIsIncidentDialogOpen(false);
  };

  const handleDeleteIncident = async (incidentId: string) => {
    const result = await deleteIncident(incidentId);
    if (result.error === null) {
      loadMemberIncidents();
    }
  };

  const handleRedFlagCreated = () => {
    setIsRedFlagDialogOpen(false);
    onRedFlagChange?.();
  };

  const handleRedFlagChanged = () => {
    onRedFlagChange?.();
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

  if (!member) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{member.name}</span>
              </span>
              <div className="flex space-x-2">
                <Badge className={getPaymentStatusColor(member.payment_status)}>
                  {member.payment_status}
                </Badge>
                <Badge variant={member.is_active ? "default" : "secondary"}>
                  {member.is_active ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription>
              DNI: {member.dni}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Información Personal</TabsTrigger>
                <TabsTrigger value="incidents" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Incidencias ({memberIncidents.length})</span>
                </TabsTrigger>
                <TabsTrigger value="redflags" className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Red Flags</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Datos Personales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Nombre:</strong> {member.name}
                      </div>
                      <div>
                        <strong>DNI:</strong> {member.dni}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{member.email}</span>
                    </div>
                    
                    {member.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    
                    {member.address && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{member.address}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Socio desde: {new Date(member.join_date).toLocaleDateString()}</span>
                    </div>

                    {!member.is_active && member.deactivation_date && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <div className="text-sm text-red-800">
                          <strong>Fecha de baja:</strong> {new Date(member.deactivation_date).toLocaleDateString()}
                        </div>
                        {member.deactivation_reason && (
                          <div className="text-sm text-red-700 mt-1">
                            <strong>Motivo:</strong> {member.deactivation_reason}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="incidents" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Incidencias</h3>
                  <Button 
                    size="sm"
                    onClick={() => setIsIncidentDialogOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Nueva Incidencia</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  {memberIncidents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No hay incidencias registradas para este socio
                    </div>
                  ) : (
                    memberIncidents.map((incident) => (
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
                                  <AlertDialogTitle>¿Eliminar incidencia?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. La incidencia será eliminada permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
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
                    <span>Nueva Red Flag</span>
                  </Button>
                </div>

                <RedFlagsList 
                  entityType="member" 
                  entityId={member.id} 
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
        entityType="member"
        entityId={member.id}
        entityName={member.name}
      />
    </>
  );
};
