
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export interface ReportData {
  members: any[];
  plots: any[];
  payments: any[];
  redFlags: any[];
}

export const useReports = () => {
  const [loading, setLoading] = useState(false);

  const fetchAllData = async (): Promise<ReportData> => {
    const [membersRes, plotsRes, paymentsRes, redFlagsRes] = await Promise.all([
      supabase.from('members').select('*').order('name'),
      supabase.from('plots').select(`
        *,
        member:members!assigned_member_id(name, dni, email)
      `).order('number'),
      supabase.from('payments').select(`
        *,
        member:members(name, dni),
        plot:plots(number)
      `).order('created_at', { ascending: false }),
      supabase.from('red_flags').select('*').order('created_at', { ascending: false })
    ]);

    return {
      members: membersRes.data || [],
      plots: plotsRes.data || [],
      payments: paymentsRes.data || [],
      redFlags: redFlagsRes.data || []
    };
  };

  const generateMembersReport = async () => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      
      const activeMembers = data.members.filter(m => m.is_active);
      const inactiveMembers = data.members.filter(m => !m.is_active);

      // Preparar datos para Excel
      const activeMembersData = activeMembers.map(member => ({
        'Nombre': member.name,
        'DNI': member.dni,
        'Email': member.email,
        'Teléfono': member.phone || 'N/A',
        'Dirección': member.address || 'N/A',
        'Fecha de Alta': new Date(member.join_date).toLocaleDateString('es-ES'),
        'Estado de Pago': member.payment_status,
        'Estado': 'Activo'
      }));

      const inactiveMembersData = inactiveMembers.map(member => ({
        'Nombre': member.name,
        'DNI': member.dni,
        'Email': member.email,
        'Teléfono': member.phone || 'N/A',
        'Dirección': member.address || 'N/A',
        'Fecha de Alta': new Date(member.join_date).toLocaleDateString('es-ES'),
        'Fecha de Baja': member.deactivation_date ? new Date(member.deactivation_date).toLocaleDateString('es-ES') : 'N/A',
        'Motivo de Baja': member.deactivation_reason || 'N/A',
        'Estado': 'Inactivo'
      }));

      // Crear workbook
      const wb = XLSX.utils.book_new();
      
      // Hoja de socios activos
      const wsActive = XLSX.utils.json_to_sheet(activeMembersData);
      XLSX.utils.book_append_sheet(wb, wsActive, 'Socios Activos');
      
      // Hoja de socios inactivos
      const wsInactive = XLSX.utils.json_to_sheet(inactiveMembersData);
      XLSX.utils.book_append_sheet(wb, wsInactive, 'Socios Inactivos');

      // Hoja resumen
      const summaryData = [
        { 'Concepto': 'Total Socios', 'Cantidad': data.members.length },
        { 'Concepto': 'Socios Activos', 'Cantidad': activeMembers.length },
        { 'Concepto': 'Socios Inactivos', 'Cantidad': inactiveMembers.length },
        { 'Concepto': 'Pagos Pendientes', 'Cantidad': activeMembers.filter(m => m.payment_status === 'pendiente').length },
        { 'Concepto': 'Fecha del Reporte', 'Cantidad': new Date().toLocaleDateString('es-ES') }
      ];
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');

      // Descargar archivo
      const fileName = `listado_socios_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('Reporte de socios generado y descargado exitosamente');
      return { success: true, fileName };
    } catch (error) {
      console.error('Error generating members report:', error);
      toast.error('Error al generar el reporte de socios');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const generatePlotsReport = async () => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      
      const plotsData = data.plots.map(plot => ({
        'Número': plot.number,
        'Tamaño': plot.size,
        'Ubicación': plot.location,
        'Estado': plot.status,
        'Socio Asignado': plot.member?.name || 'Sin asignar',
        'DNI del Socio': plot.member?.dni || 'N/A',
        'Fecha de Asignación': plot.assigned_date ? new Date(plot.assigned_date).toLocaleDateString('es-ES') : 'N/A'
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(plotsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Estado de Parcelas');

      // Hoja resumen
      const totalPlots = data.plots.length;
      const occupiedPlots = data.plots.filter(p => p.status === 'ocupada').length;
      const availablePlots = data.plots.filter(p => p.status === 'disponible').length;
      const maintenancePlots = data.plots.filter(p => p.status === 'mantenimiento').length;

      const summaryData = [
        { 'Concepto': 'Total Parcelas', 'Cantidad': totalPlots },
        { 'Concepto': 'Parcelas Ocupadas', 'Cantidad': occupiedPlots },
        { 'Concepto': 'Parcelas Disponibles', 'Cantidad': availablePlots },
        { 'Concepto': 'Parcelas en Mantenimiento', 'Cantidad': maintenancePlots },
        { 'Concepto': 'Porcentaje de Ocupación', 'Cantidad': `${Math.round((occupiedPlots / totalPlots) * 100)}%` },
        { 'Concepto': 'Fecha del Reporte', 'Cantidad': new Date().toLocaleDateString('es-ES') }
      ];
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');

      const fileName = `estado_parcelas_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('Reporte de parcelas generado y descargado exitosamente');
      return { success: true, fileName };
    } catch (error) {
      console.error('Error generating plots report:', error);
      toast.error('Error al generar el reporte de parcelas');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const generatePaymentsReport = async (year?: number) => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      
      let filteredPayments = data.payments;
      if (year) {
        filteredPayments = data.payments.filter(p => p.payment_year === year);
      }

      const paymentsData = filteredPayments.map(payment => ({
        'Número de Recibo': payment.receipt_number || 'N/A',
        'Socio': payment.member?.name || 'N/A',
        'DNI': payment.member?.dni || 'N/A',
        'Tipo de Pago': payment.payment_type,
        'Concepto': payment.concept || 'N/A',
        'Parcela': payment.plot?.number || 'N/A',
        'Importe': payment.amount,
        'Fecha de Pago': new Date(payment.payment_date).toLocaleDateString('es-ES'),
        'Año': payment.payment_year
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(paymentsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Pagos');

      // Resumen financiero
      const totalAmount = filteredPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const paymentsByType = filteredPayments.reduce((acc, payment) => {
        acc[payment.payment_type] = (acc[payment.payment_type] || 0) + Number(payment.amount);
        return acc;
      }, {} as Record<string, number>);

      const summaryData = [
        { 'Concepto': 'Total de Pagos', 'Cantidad': filteredPayments.length },
        { 'Concepto': 'Importe Total', 'Cantidad': `${totalAmount}€` },
        { 'Concepto': 'Promedio por Pago', 'Cantidad': `${(totalAmount / filteredPayments.length).toFixed(2)}€` },
        ...Object.entries(paymentsByType).map(([type, amount]) => ({
          'Concepto': `Ingresos por ${type}`,
          'Cantidad': `${amount}€`
        })),
        { 'Concepto': 'Año del Reporte', 'Cantidad': year || 'Todos' },
        { 'Concepto': 'Fecha del Reporte', 'Cantidad': new Date().toLocaleDateString('es-ES') }
      ];
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen Financiero');

      const fileName = `resumen_pagos_${year || 'todos'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('Reporte de pagos generado y descargado exitosamente');
      return { success: true, fileName };
    } catch (error) {
      console.error('Error generating payments report:', error);
      toast.error('Error al generar el reporte de pagos');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const generateAnnualReport = async (year: number) => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      
      const yearPayments = data.payments.filter(p => p.payment_year === year);
      const yearMembers = data.members.filter(m => 
        new Date(m.join_date).getFullYear() <= year && 
        (m.is_active || (m.deactivation_date && new Date(m.deactivation_date).getFullYear() > year))
      );

      const wb = XLSX.utils.book_new();

      // Resumen anual
      const annualSummary = [
        { 'Concepto': 'Año del Informe', 'Valor': year },
        { 'Concepto': 'Total de Socios Activos', 'Valor': yearMembers.filter(m => m.is_active).length },
        { 'Concepto': 'Nuevas Altas', 'Valor': data.members.filter(m => new Date(m.join_date).getFullYear() === year).length },
        { 'Concepto': 'Bajas del Año', 'Valor': data.members.filter(m => m.deactivation_date && new Date(m.deactivation_date).getFullYear() === year).length },
        { 'Concepto': 'Total de Parcelas', 'Valor': data.plots.length },
        { 'Concepto': 'Parcelas Ocupadas', 'Valor': data.plots.filter(p => p.status === 'ocupada').length },
        { 'Concepto': 'Total de Pagos Recibidos', 'Valor': yearPayments.length },
        { 'Concepto': 'Ingresos Totales', 'Valor': `${yearPayments.reduce((sum, p) => sum + Number(p.amount), 0)}€` },
        { 'Concepto': 'Fecha de Generación', 'Valor': new Date().toLocaleDateString('es-ES') }
      ];
      const wsAnnual = XLSX.utils.json_to_sheet(annualSummary);
      XLSX.utils.book_append_sheet(wb, wsAnnual, 'Resumen Anual');

      // Detalles de ingresos por mes
      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const monthPayments = yearPayments.filter(p => new Date(p.payment_date).getMonth() + 1 === month);
        return {
          'Mes': new Date(year, i).toLocaleDateString('es-ES', { month: 'long' }),
          'Número de Pagos': monthPayments.length,
          'Ingresos': `${monthPayments.reduce((sum, p) => sum + Number(p.amount), 0)}€`
        };
      });
      const wsMonthly = XLSX.utils.json_to_sheet(monthlyData);
      XLSX.utils.book_append_sheet(wb, wsMonthly, 'Ingresos Mensuales');

      const fileName = `informe_anual_${year}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success(`Informe anual ${year} generado y descargado exitosamente`);
      return { success: true, fileName };
    } catch (error) {
      console.error('Error generating annual report:', error);
      toast.error('Error al generar el informe anual');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const generatePendingPaymentsReport = async () => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      
      const pendingMembers = data.members.filter(m => m.is_active && m.payment_status === 'pendiente');
      
      const pendingData = pendingMembers.map(member => ({
        'Nombre': member.name,
        'DNI': member.dni,
        'Email': member.email,
        'Teléfono': member.phone || 'N/A',
        'Estado de Pago': member.payment_status,
        'Fecha de Alta': new Date(member.join_date).toLocaleDateString('es-ES'),
        'Días desde Alta': Math.floor((new Date().getTime() - new Date(member.join_date).getTime()) / (1000 * 60 * 60 * 24))
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(pendingData);
      XLSX.utils.book_append_sheet(wb, ws, 'Pagos Pendientes');

      const fileName = `pagos_pendientes_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('Reporte de pagos pendientes generado y descargado exitosamente');
      return { success: true, fileName };
    } catch (error) {
      console.error('Error generating pending payments report:', error);
      toast.error('Error al generar el reporte de pagos pendientes');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateMembersReport,
    generatePlotsReport,
    generatePaymentsReport,
    generateAnnualReport,
    generatePendingPaymentsReport
  };
};
