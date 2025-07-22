
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Plus } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";

interface MemberCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemberCreationDialog = ({ isOpen, onClose }: MemberCreationDialogProps) => {
  const { createMember } = useMembers();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!firstName.trim() || !dni.trim() || !email.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createMember({
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
        dni: dni.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        postal_code: postalCode.trim() || undefined,
        city: city.trim() || undefined
      });

      if (result.error === null) {
        // Reset form
        setFirstName('');
        setLastName('');
        setDni('');
        setEmail('');
        setPhone('');
        setAddress('');
        setPostalCode('');
        setCity('');
        onClose();
      }
    } catch (error) {
      console.error('Error creating member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFirstName('');
      setLastName('');
      setDni('');
      setEmail('');
      setPhone('');
      setAddress('');
      setPostalCode('');
      setCity('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Nou Soci</span>
          </DialogTitle>
          <DialogDescription>
            Crear un nou soci al sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first-name">Nom *</Label>
              <Input
                id="first-name"
                placeholder="Nom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="last-name">Cognoms</Label>
              <Input
                id="last-name"
                placeholder="Cognoms"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="dni">DNI *</Label>
            <Input
              id="dni"
              placeholder="12345678A"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="email">Correu electrònic *</Label>
            <Input
              id="email"
              type="email"
              placeholder="correu@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="phone">Telèfon</Label>
            <Input
              id="phone"
              placeholder="600123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="address">Adreça</Label>
            <Textarea
              id="address"
              placeholder="Adreça completa"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postal-code">Codi Postal</Label>
              <Input
                id="postal-code"
                placeholder="07142"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                maxLength={5}
                pattern="[0-9]{5}"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="city">Ciutat</Label>
              <Input
                id="city"
                placeholder="Santa Eugènia"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel·lar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!firstName.trim() || !dni.trim() || !email.trim() || isSubmitting}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creant...' : 'Crear Soci'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
