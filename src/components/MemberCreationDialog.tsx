
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
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !dni.trim() || !email.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createMember({
        name: name.trim(),
        dni: dni.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined
      });

      if (result.error === null) {
        // Reset form
        setName('');
        setDni('');
        setEmail('');
        setPhone('');
        setAddress('');
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
      setName('');
      setDni('');
      setEmail('');
      setPhone('');
      setAddress('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Nuevo Socio</span>
          </DialogTitle>
          <DialogDescription>
            Crear un nuevo socio en el sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
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
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              placeholder="600123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="address">Dirección</Label>
            <Textarea
              id="address"
              placeholder="Dirección completa"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!name.trim() || !dni.trim() || !email.trim() || isSubmitting}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creando...' : 'Crear Socio'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
