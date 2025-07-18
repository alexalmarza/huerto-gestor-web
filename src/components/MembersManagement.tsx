
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Users, UserCheck, UserX, AlertCircle } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { MemberCard } from "./MemberCard";
import { MemberCreationDialog } from "./MemberCreationDialog";

export const MembersManagement = () => {
  const { members, loading, refetch } = useMembers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isCreationDialogOpen, setIsCreationDialogOpen] = useState(false);

  // Filter only ACTIVE members
  const activeMembers = members.filter(member => member.is_active);

  // Calculate statistics only for active members
  const totalActiveMembers = activeMembers.length;
  const totalMembers = members.length;
  const inactiveMembers = members.filter(member => !member.is_active).length;
  const pendingPayments = activeMembers.filter(member => member.payment_status === 'pendiente').length;

  // Filter active members based on search and payment filters
  const filteredMembers = activeMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.dni.includes(searchTerm) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
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
            <Button onClick={() => setIsCreationDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nou Soci
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cercar per nom, DNI o correu electrònic..."
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
    </div>
  );
};
