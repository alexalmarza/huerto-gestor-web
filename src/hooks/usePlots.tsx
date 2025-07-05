import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

export interface Plot {
  id: string;
  number: string;
  size: string;
  location: string;
  status: 'ocupada' | 'disponible' | 'mantenimiento';
  assigned_member_id: string | null;
  assigned_date: string | null;
  created_at: string;
  updated_at: string;
  member?: {
    name: string;
  };
}

export interface CreatePlotData {
  number: string;
  size: string;
  location: string;
}

export interface AssignPlotData {
  assigned_member_id: string;
}

export const usePlots = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlots = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('plots')
        .select(`
          *,
          member:members!assigned_member_id(name)
        `)
        .order('number');

      if (error) throw error;
      console.log('Plots fetched:', data); // Debug log
      
      setPlots((data || []) as Plot[]);
    } catch (error) {
      console.error('Error fetching plots:', error);
      toast.error('Error al cargar las parcelas');
    } finally {
      setLoading(false);
    }
  };

  const createPlot = async (plotData: CreatePlotData) => {
    try {
      const { data, error } = await supabase
        .from('plots')
        .insert([plotData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchPlots(); // Refrescar la lista completa
      toast.success('Parcela creada exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating plot:', error);
      toast.error('Error al crear la parcela');
      return { data: null, error };
    }
  };

  const assignPlot = async (plotId: string, assignData: AssignPlotData) => {
    try {
      console.log('Assigning plot:', plotId, 'to member:', assignData.assigned_member_id); // Debug log
      
      const { data, error } = await supabase
        .from('plots')
        .update({
          assigned_member_id: assignData.assigned_member_id,
          assigned_date: new Date().toISOString(),
          status: 'ocupada'
        })
        .eq('id', plotId)
        .select(`
          *,
          member:members!assigned_member_id(name)
        `)
        .single();

      if (error) throw error;

      console.log('Plot assigned successfully:', data); // Debug log
      
      // Refetch all data to ensure consistency
      await fetchPlots();
      
      toast.success('Parcela asignada exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error assigning plot:', error);
      toast.error('Error al asignar la parcela');
      return { data: null, error };
    }
  };

  const unassignPlot = async (plotId: string) => {
    try {
      console.log('Unassigning plot:', plotId); // Debug log
      
      const { data, error } = await supabase
        .from('plots')
        .update({
          assigned_member_id: null,
          assigned_date: null,
          status: 'disponible'
        })
        .eq('id', plotId)
        .select()
        .single();

      if (error) throw error;

      console.log('Plot unassigned successfully:', data); // Debug log
      
      // Refetch all data to ensure consistency
      await fetchPlots();
      
      toast.success('Parcela liberada exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error unassigning plot:', error);
      toast.error('Error al liberar la parcela');
      return { data: null, error };
    }
  };

  const updatePlot = async (id: string, updates: Partial<Plot>) => {
    try {
      const { data, error } = await supabase
        .from('plots')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchPlots(); // Refrescar la lista completa
      toast.success('Parcela actualizada exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating plot:', error);
      toast.error('Error al actualizar la parcela');
      return { data: null, error };
    }
  };

  const deletePlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('plots')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPlots(); // Refrescar la lista completa
      toast.success('Parcela eliminada exitosamente');
      return { error: null };
    } catch (error) {
      console.error('Error deleting plot:', error);
      toast.error('Error al eliminar la parcela');
      return { error };
    }
  };

  const generateRentalContractPDF = async (plot: Plot) => {
    try {
      if (!plot.member?.name || !plot.assigned_date) {
        toast.error('No se puede generar el contrato: falta información de asignación');
        return { data: null, error: 'Missing assignment information' };
      }

      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString('es-ES');
      const assignedDate = new Date(plot.assigned_date).toLocaleDateString('es-ES');
      
      // Valores del contrato
      const annualQuota = 120; // Cuota anual por defecto
      const deposit = 25; // Fianza
      const total = annualQuota + deposit;
      
      // Título del contrato
      doc.setFontSize(18);
      doc.text('CONTRATO DE ARRENDAMIENTO DE HUERTO', 105, 25, { align: 'center' });
      
      // Información de la parcela
      doc.setFontSize(14);
      doc.text('DATOS DE LA PARCELA', 20, 50);
      doc.setFontSize(11);
      doc.text(`Número de Parcela: ${plot.number}`, 20, 65);
      doc.text(`Tamaño: ${plot.size}`, 20, 75);
      doc.text(`Ubicación: ${plot.location}`, 20, 85);
      doc.text(`Fecha de Asignación: ${assignedDate}`, 20, 95);
      
      // Información del arrendatario
      doc.setFontSize(14);
      doc.text('DATOS DEL ARRENDATARIO', 20, 115);
      doc.setFontSize(11);
      doc.text(`Nombre: ${plot.member.name}`, 20, 130);
      
      // Condiciones económicas
      doc.setFontSize(14);
      doc.text('CONDICIONES ECONÓMICAS', 20, 150);
      doc.setFontSize(11);
      doc.text(`Cuota Anual del Huerto: ${annualQuota}€`, 20, 165);
      doc.text(`Fianza: ${deposit}€`, 20, 175);
      doc.text(`TOTAL A PAGAR: ${total}€`, 20, 190);
      
      // Términos y condiciones
      doc.setFontSize(12);
      doc.text('TÉRMINOS Y CONDICIONES', 20, 210);
      doc.setFontSize(10);
      
      const terms = [
        '1. El presente contrato tiene una duración de un año natural.',
        '2. La cuota anual debe abonarse al inicio del período de arrendamiento.',
        '3. La fianza será devuelta al finalizar el contrato si no hay daños.',
        '4. El arrendatario se compromete a mantener la parcela en buen estado.',
        '5. Cualquier modificación debe ser acordada por escrito.',
      ];
      
      terms.forEach((term, index) => {
        doc.text(term, 20, 225 + (index * 8));
      });
      
      // Firmas
      doc.text('Firma del Arrendador: ________________________', 20, 275);
      doc.text('Firma del Arrendatario: ________________________', 20, 285);
      doc.text(`Fecha: ${currentDate}`, 20, 295);
      
      // Generar y descargar el PDF
      const fileName = `contrato_parcela_${plot.number}_${plot.member.name.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`;
      doc.save(fileName);
      
      toast.success('Contrato PDF generado y descargado exitosamente');
      return { data: { fileName }, error: null };
    } catch (error) {
      console.error('Error generating rental contract:', error);
      toast.error('Error al generar el contrato PDF');
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  return {
    plots,
    loading,
    createPlot,
    assignPlot,
    unassignPlot,
    updatePlot,
    deletePlot,
    generateRentalContractPDF,
    refetch: fetchPlots
  };
};
