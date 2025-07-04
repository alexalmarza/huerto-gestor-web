import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMembers } from "@/hooks/useMembers";
import { usePlots } from "@/hooks/usePlots";
import { usePayments, CreatePaymentData } from "@/hooks/usePayments";

interface PaymentRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentRegistered?: () => void;
}

export const PaymentRegistrationDialog = ({ isOpen, onClose, onPaymentRegistered }: PaymentRegistrationDialogProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [paymentType, setPaymentType] = useState<'parcela' | 'material' | 'alquiler'>('parcela');
  const [selectedPlotId, setSelectedPlotId] = useState("");
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { members } = useMembers();
  const { plots } = usePlots();
  const { createPayment } = usePayments();

  // Filter available plots for the selected member
  const memberPlots = plots.filter(plot => plot.assigned_member_id === selectedMemberId);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedMemberId("");
      setPaymentType('parcela');
      setSelectedPlotId("");
      setConcept("");
      setAmount("");
      setPaymentDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);

  // Auto-populate amount for 'parcela' type
  useEffect(() => {
    if (paymentType === 'parcela') {
      setAmount("120"); // Default plot payment amount
    } else {
      setAmount("");
    }
  }, [paymentType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMemberId || !amount) {
      return;
    }

    const paymentData: CreatePaymentData = {
      member_id: selectedMemberId,
      payment_type: paymentType,
      amount: parseFloat(amount),
      payment_date: paymentDate,
      payment_year: new Date(paymentDate).getFullYear()
    };

    // Add specific fields based on payment type
    if (paymentType === 'parcela' && selectedPlotId) {
      paymentData.plot_id = selectedPlotId;
    } else if (paymentType === 'material' || paymentType === 'alquiler') {
      paymentData.concept = concept;
    }

    const result = await createPayment(paymentData);
    if (result.error === null) {
      onPaymentRegistered?.();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Pago</DialogTitle>
          <DialogDescription>
            Registra un pago realizado por un socio
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="member">Socio</Label>
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar socio" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} - {member.dni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paymentType">Tipo de Pago</Label>
            <Select value={paymentType} onValueChange={(value: 'parcela' | 'material' | 'alquiler') => setPaymentType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parcela">Parcela</SelectItem>
                <SelectItem value="material">Material</SelectItem>
                <SelectItem value="alquiler">Alquiler de Material</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentType === 'parcela' && (
            <div>
              <Label htmlFor="plot">Parcela</Label>
              <Select value={selectedPlotId} onValueChange={setSelectedPlotId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar parcela" />
                </SelectTrigger>
                <SelectContent>
                  {memberPlots.map((plot) => (
                    <SelectItem key={plot.id} value={plot.id}>
                      Parcela #{plot.number} - {plot.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(paymentType === 'material' || paymentType === 'alquiler') && (
            <div>
              <Label htmlFor="concept">
                {paymentType === 'material' ? 'Concepto' : 'Material'}
              </Label>
              <Input
                id="concept"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder={`Descripción del ${paymentType === 'material' ? 'concepto' : 'material'}`}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Importe (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="paymentDate">Fecha de Pago</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Registrar Pago
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
