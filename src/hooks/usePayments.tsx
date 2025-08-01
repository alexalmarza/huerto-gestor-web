
import { useState, useEffect, useCallback } from 'react';
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
    first_name: string;
    last_name: string | null;
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
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPayments = useCallback(async (page: number = 0, pageSize: number = 10, filterYear?: number) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('payments')
        .select(`
          *,
          member:members(first_name, last_name, dni),
          plot:plots(number)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filterYear) {
        query = query.eq('payment_year', filterYear);
      }

      const from = page * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      
      setPayments((data || []) as Payment[]);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Error al cargar los pagos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayment = async (paymentData: CreatePaymentData) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select(`
          *,
          member:members(first_name, last_name, dni),
          plot:plots(number)
        `)
        .single();

      if (error) throw error;
      
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
      
      doc.setFontSize(20);
      doc.text('RECIBO DE PAGO', 105, 30, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Número de Recibo: ${payment.receipt_number || 'N/A'}`, 20, 60);
      doc.text(`Fecha: ${new Date(payment.payment_date).toLocaleDateString()}`, 20, 70);
      doc.text(`Año: ${payment.payment_year}`, 20, 80);
      
      doc.setFontSize(14);
      doc.text('DATOS DEL SOCIO', 20, 100);
      doc.setFontSize(12);
      doc.text(`Nombre: ${payment.member?.first_name || ''} ${payment.member?.last_name || ''}`, 20, 115);
      doc.text(`DNI: ${payment.member?.dni || 'N/A'}`, 20, 125);
      
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
      
      doc.setFontSize(10);
      doc.text('Este recibo es válido como comprobante de pago.', 20, 250);
      doc.text(`Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`, 20, 260);
      
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

  return {
    payments,
    loading,
    totalCount,
    createPayment,
    deletePayment,
    generateReceiptPDF,
    fetchPayments
  };
};
