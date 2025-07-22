
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Users, UserCheck, UserX, AlertCircle, Download, Upload, Trash2 } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { MemberCard } from "./MemberCard";
import { MemberCreationDialog } from "./MemberCreationDialog";
import { ExcelImportDialog } from "./ExcelImportDialog";
import { generateMembersTemplate, MEMBERS_EXPECTED_COLUMNS } from "@/utils/excelTemplates";
import { toast } from "sonner";

export const MembersManagement = () => {
  const { members, loading, refetch, createMember } = useMembers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isCreationDialogOpen, setIsCreationDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Filter only ACTIVE members
  const activeMembers = members.filter(member => member.is_active);

  // Calculate statistics only for active members
  const totalActiveMembers = activeMembers.length;
  const totalMembers = members.length;
  const inactiveMembers = members.filter(member => !member.is_active).length;
  const pendingPayments = activeMembers.filter(member => member.payment_status === 'pendiente').length;

  // Filter active members based on search and payment filters
  const filteredMembers = activeMembers.filter(member => {
    const matchesSearch = member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.last_name && member.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         member.dni.includes(searchTerm) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.postal_code && member.postal_code.includes(searchTerm)) ||
                         (member.city && member.city.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Remove status filter logic since we only show active members here
    const matchesPayment = paymentFilter === "all" || member.payment_status === paymentFilter;
    
    return matchesSearch && matchesPayment;
  });

  const handleMemberUpdated = () => {
    refetch();
  };

  const handleCreationDialogClose = () => {
    setIsCreationDialogOpen(false);
    refetch(); // Refresh the list when dialog closes
  };

  const handleImportMembers = async (data: any[]) => {
    try {
      for (const memberData of data) {
        await createMember({
          first_name: memberData.first_name || memberData.nom || '',
          last_name: memberData.last_name || memberData.cognoms || '',
          dni: memberData.dni || '',
          email: memberData.email || memberData.correu || '',
          phone: memberData.phone || memberData.telefon_mobil || '',
          landline_phone: memberData.landline_phone || memberData.telefon_fix || '',
          address: memberData.address || memberData.adreca || '',
          postal_code: memberData.postal_code || memberData.codi_postal || '',
          city: memberData.city || memberData.ciutat || ''
        });
      }
      toast.success(`${data.length} socios importats correctament`);
      refetch();
    } catch (error) {
      console.error('Error importing members:', error);
      toast.error('Error en importar els socios');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Socis</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actius</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalActiveMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactius</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagaments Pendents</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Socis Actius</CardTitle>
              <CardDescription>
                Administra la informació dels socis actius de l'hort
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateMembersTemplate}
              >
                <Download className="h-4 w-4 mr-2" />
                Descarregar plantilla
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsImportDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Excel
              </Button>
              <Button onClick={() => setIsCreationDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nou Soci
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cercar per nom, DNI, correu, codi postal o ciutat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Pagaments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tots els pagaments</SelectItem>
                <SelectItem value="al día">Al dia</SelectItem>
                <SelectItem value="pendiente">Pendent</SelectItem>
                <SelectItem value="vencido">Vençut</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Members Grid */}
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || paymentFilter !== "all" 
                ? "No s'han trobat socis actius que coincideixin amb els filtres"
                : "No hi ha socis actius registrats"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <MemberCard 
                  key={member.id} 
                  member={member} 
                  onMemberUpdated={handleMemberUpdated}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <MemberCreationDialog
        isOpen={isCreationDialogOpen}
        onClose={handleCreationDialogClose}
      />

      <ExcelImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImportMembers}
        title="Importar Socios"
        description="Importa socios des d'un fitxer Excel. Els nous socios s'afegiran als existents."
        expectedColumns={MEMBERS_EXPECTED_COLUMNS}
      />
    </div>
  );
};
