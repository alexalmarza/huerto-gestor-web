
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, MapPin, AlertTriangle, Home } from "lucide-react";
import { Member } from "@/hooks/useMembers";
import { useEntityRedFlags } from "@/hooks/useEntityRedFlags";
import { MemberDetailsDialog } from "./MemberDetailsDialog";
import { WhatsAppButton } from "./WhatsAppButton";

interface MemberCardProps {
  member: Member;
  onMemberUpdated?: () => void;
}

export const MemberCard = ({ member, onMemberUpdated }: MemberCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { hasActiveRedFlags } = useEntityRedFlags('member', member.id);

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

  const cardClassName = hasActiveRedFlags 
    ? "bg-red-50 border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
    : "hover:shadow-md transition-shadow cursor-pointer";

  return (
    <>
      <Card 
        className={cardClassName}
        onClick={() => setIsDetailsOpen(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>{member.name}</span>
              {hasActiveRedFlags && (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </CardTitle>
            <div className="flex space-x-2">
              <Badge className={getPaymentStatusColor(member.payment_status)}>
                {getPaymentStatusText(member.payment_status)}
              </Badge>
              <Badge variant={member.is_active ? "default" : "secondary"}>
                {member.is_active ? "Actiu" : "Inactiu"}
              </Badge>
            </div>
          </div>
          <CardDescription>DNI: {member.dni}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{member.email}</span>
          </div>
          {member.phone && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{member.phone}</span>
              </div>
              <WhatsAppButton phoneNumber={member.phone} />
            </div>
          )}
          {member.address && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{member.address}</span>
            </div>
          )}
          {member.assigned_plot && (
            <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded">
              <Home className="h-4 w-4" />
              <span>
                <strong>Parcel·la #{member.assigned_plot.number}</strong>
                <span className="text-gray-600 ml-1">
                  ({member.assigned_plot.size}, {member.assigned_plot.location})
                </span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <MemberDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        member={member}
        onMemberUpdated={onMemberUpdated}
      />
    </>
  );
};
