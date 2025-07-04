import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

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
      
      // Add the new payment to the current list immediately for better UX
      if (data) {
        setPayments(prevPayments => [data as Payment, ...prevPayments]);
      }
      
      // Also fetch fresh data to ensure consistency
      await fetchPayments();
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
      
      // Remove the payment from the current list immediately
      setPayments(prevPayments => prevPayments.filter(payment => payment.id !== paymentId));
      
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
      const doc = new jsPDF();
      
      // Configurar el documento
      doc.setFontSize(20);
      doc.text('RECIBO DE PAGO', 105, 30, { align: 'center' });
      
      // Información del recibo
      doc.setFontSize(12);
      doc.text(`Número de Recibo: ${payment.receipt_number || 'N/A'}`, 20, 60);
      doc.text(`Fecha: ${new Date(payment.payment_date).toLocaleDateString()}`, 20, 70);
      doc.text(`Año: ${payment.payment_year}`, 20, 80);
      
      // Información del socio
      doc.setFontSize(14);
      doc.text('DATOS DEL SOCIO', 20, 100);
      doc.setFontSize(12);
      doc.text(`Nombre: ${payment.member?.name || 'N/A'}`, 20, 115);
      doc.text(`DNI: ${payment.member?.dni || 'N/A'}`, 20, 125);
      
      // Información del pago
      doc.setFontSize(14);
      doc.text('DETALLES DEL PAGO', 20, 145);
      doc.setFontSize(12);
      doc.text(`Tipo de Pago: ${payment.payment_type.toUpperCase()}`, 20, 160);
      doc.text(`Importe: ${payment.amount}€`, 20, 170);
      
      if (payment.plot?.number) {
        doc.text(`Parcela: #${payment.plot.number}`, 20, 180);
      }
      
      if (payment.concept) {
        doc.text(`Concepto: ${payment.concept}`, 20, 190);
      }
      
      // Pie del documento
      doc.setFontSize(10);
      doc.text('Este recibo es válido como comprobante de pago.', 20, 250);
      doc.text(`Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`, 20, 260);
      
      // Descargar el PDF
      const fileName = `recibo_${payment.receipt_number || payment.id}_${payment.payment_year}.pdf`;
      doc.save(fileName);
      
      toast.success('Recibo PDF generado y descargado exitosamente');
      return { data: { fileName }, error: null };
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Error al generar el recibo PDF');
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
