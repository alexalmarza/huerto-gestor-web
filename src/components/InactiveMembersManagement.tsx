
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserX, AlertCircle } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { MemberCard } from "./MemberCard";

export const InactiveMembersManagement = () => {
  const { members, loading, refetch } = useMembers();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Filter only INACTIVE members
  const inactiveMembers = members.filter(member => !member.is_active);

  // Calculate statistics only for inactive members
  const totalInactiveMembers = inactiveMembers.length;
  const pendingPayments = inactiveMembers.filter(member => member.payment_status === 'pendiente').length;

  // Filter inactive members based on search and payment filters
  const filteredMembers = inactiveMembers.filter(member => {
    const matchesSearch = member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.last_name && member.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         member.dni.includes(searchTerm) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPayment = paymentFilter === "all" || member.payment_status === paymentFilter;
    
    return matchesSearch && matchesPayment;
  });

  const handleMemberUpdated = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Socis Inactius</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalInactiveMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amb Pagaments Pendents</CardTitle>
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
              <CardTitle>Socis Inactius</CardTitle>
              <CardDescription>
                Gestiona els socis que han estat desactivats de l'hort
              </CardDescription>
            </div>
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
                ? "No s'han trobat socis inactius que coincideixin amb els filtres"
                : "No hi ha socis inactius registrats"}
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
    </div>
  );
};
