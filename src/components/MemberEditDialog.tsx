
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [landlinePhone, setLandlinePhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'al día' | 'pendiente' | 'vencido'>('pendiente');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateMember } = useMembers();

  useEffect(() => {
    if (member && isOpen) {
      setFirstName(member.first_name);
      setLastName(member.last_name || '');
      setDni(member.dni);
      setEmail(member.email);
      setPhone(member.phone || '');
      setLandlinePhone(member.landline_phone || '');
      setAddress(member.address || '');
      setPostalCode(member.postal_code || '');
      setCity(member.city || '');
      setPaymentStatus(member.payment_status as 'al día' | 'pendiente' | 'vencido');
    }
  }, [member, isOpen]);

  const handleSubmit = async () => {
    if (!member || !firstName || !dni || !email) {
      return;
    }

    setIsSubmitting(true);
    
    const result = await updateMember(member.id, {
      first_name: firstName,
      last_name: lastName || null,
      dni,
      email,
      phone: phone || null,
      landline_phone: landlinePhone || null,
      address: address || null,
      postal_code: postalCode || null,
      city: city || null,
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
      setFirstName(member.first_name);
      setLastName(member.last_name || '');
      setDni(member.dni);
      setEmail(member.email);
      setPhone(member.phone || '');
      setLandlinePhone(member.landline_phone || '');
      setAddress(member.address || '');
      setPostalCode(member.postal_code || '');
      setCity(member.city || '');
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
            <span>Editar Soci</span>
          </DialogTitle>
          <DialogDescription>
            Modificar la informació del soci: {member.first_name} {member.last_name || ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-first-name">Nom *</Label>
              <Input
                id="edit-first-name"
                placeholder="Nom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-last-name">Cognoms</Label>
              <Input
                id="edit-last-name"
                placeholder="Cognoms"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
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
            <Label htmlFor="edit-email">Correu electrònic *</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="correu@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-phone">Telèfon mòbil</Label>
              <Input
                id="edit-phone"
                placeholder="600123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-landline-phone">Telèfon fix</Label>
              <Input
                id="edit-landline-phone"
                placeholder="971123456"
                value={landlinePhone}
                onChange={(e) => setLandlinePhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-address">Adreça</Label>
            <Textarea
              id="edit-address"
              placeholder="Adreça completa"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-postal-code">Codi Postal</Label>
              <Input
                id="edit-postal-code"
                placeholder="07142"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                maxLength={5}
                pattern="[0-9]{5}"
              />
            </div>
            <div>
              <Label htmlFor="edit-city">Ciutat</Label>
              <Input
                id="edit-city"
                placeholder="Santa Eugènia"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-payment-status">Estat de Pagament</Label>
            <Select value={paymentStatus} onValueChange={(value: 'al día' | 'pendiente' | 'vencido') => setPaymentStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="al día">Al dia</SelectItem>
                <SelectItem value="pendiente">Pendent</SelectItem>
                <SelectItem value="vencido">Vençut</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel·lar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!firstName || !dni || !email || isSubmitting}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardant...' : 'Guardar Canvis'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
