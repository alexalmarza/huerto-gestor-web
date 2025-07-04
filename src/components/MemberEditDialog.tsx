
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { Member, useMembers } from "@/hooks/useMembers";

interface MemberEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onMemberUpdated: () => void;
}

export const MemberEditDialog = ({ isOpen, onClose, member, onMemberUpdated }: MemberEditDialogProps) => {
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'al día' | 'pendiente' | 'vencido'>('pendiente');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateMember } = useMembers();

  useEffect(() => {
    if (member && isOpen) {
      setName(member.name);
      setDni(member.dni);
      setEmail(member.email);
      setPhone(member.phone || '');
      setAddress(member.address || '');
      setPaymentStatus(member.payment_status as 'al día' | 'pendiente' | 'vencido');
    }
  }, [member, isOpen]);

  const handleSubmit = async () => {
    if (!member || !name || !dni || !email) {
      return;
    }

    setIsSubmitting(true);
    
    const result = await updateMember(member.id, {
      name,
      dni,
      email,
      phone: phone || null,
      address: address || null,
      payment_status: paymentStatus
    });

    if (result.error === null) {
      onMemberUpdated();
      onClose();
    }
    
    setIsSubmitting(false);
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    if (member) {
      setName(member.name);
      setDni(member.dni);
      setEmail(member.email);
      setPhone(member.phone || '');
      setAddress(member.address || '');
      setPaymentStatus(member.payment_status as 'al día' | 'pendiente' | 'vencido');
    }
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Editar Socio</span>
          </DialogTitle>
          <DialogDescription>
            Modificar la información del socio: {member.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Nombre *</Label>
            <Input
              id="edit-name"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="edit-dni">DNI *</Label>
            <Input
              id="edit-dni"
              placeholder="12345678A"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="email@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="edit-phone">Teléfono</Label>
            <Input
              id="edit-phone"
              placeholder="600123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="edit-address">Dirección</Label>
            <Textarea
              id="edit-address"
              placeholder="Dirección completa"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="edit-payment-status">Estado de Pago</Label>
            <Select value={paymentStatus} onValueChange={(value: 'al día' | 'pendiente' | 'vencido') => setPaymentStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="al día">Al día</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!name || !dni || !email || isSubmitting}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
