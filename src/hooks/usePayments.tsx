
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Payment {
  id: string;
  member_id: string;
  payment_type: 'parcela' | 'material' | 'alquiler';
  plot_id: string | null;
  concept: string | null;
  amount: number;
  payment_date: string;
  payment_year: number;
  receipt_number: string | null;
  created_at: string;
  updated_at: string;
  member?: {
    name: string;
    dni: string;
  };
  plot?: {
    number: string;
  };
}

export interface CreatePaymentData {
  member_id: string;
  payment_type: 'parcela' | 'material' | 'alquiler';
  plot_id?: string;
  concept?: string;
  amount: number;
  payment_date?: string;
  payment_year?: number;
}

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          member:members(name, dni),
          plot:plots(number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments((data || []) as Payment[]);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Error al cargar los pagos');
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: CreatePaymentData) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select(`
          *,
          member:members(name, dni),
          plot:plots(number)
        `)
        .single();

      if (error) throw error;
      
      await fetchPayments(); // Refresh the list
      toast.success('Pago registrado exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Error al registrar el pago');
      return { data: null, error };
    }
  };

  const deletePayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;
      
      await fetchPayments(); // Refresh the list
      toast.success('Pago eliminado exitosamente');
      return { error: null };
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Error al eliminar el pago');
      return { error };
    }
  };

  const generateReceiptPDF = async (payment: Payment) => {
    try {
      // This would integrate with a PDF generation service
      // For now, we'll just show the receipt data
      const receiptData = {
        receiptNumber: payment.receipt_number,
        memberName: payment.member?.name,
        memberDni: payment.member?.dni,
        plotNumber: payment.plot?.number,
        paymentType: payment.payment_type,
        concept: payment.concept,
        amount: payment.amount,
        paymentDate: payment.payment_date,
        paymentYear: payment.payment_year
      };
      
      console.log('Receipt data:', receiptData);
      toast.success('Recibo generado (funcionalidad pendiente de implementar PDF)');
      return { data: receiptData, error: null };
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Error al generar el recibo');
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    createPayment,
    deletePayment,
    generateReceiptPDF,
    refetch: fetchPayments
  };
};
