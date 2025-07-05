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
  price: number | null;
  created_at: string;
  updated_at: string;
  member?: {
    name: string;
    dni: string;
    address: string;
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
          member:members!assigned_member_id(name, dni, address)
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
        toast.error('No es pot generar el contracte: manca informació');
        return { data: null, error: 'Falta informació d\'assignació' };
      }

      const doc = new jsPDF();
      const today = new Date();
      const year = today.getFullYear();
      const dateText = `Girona, ${today.getDate()} / ${today.toLocaleString('ca-ES', { month: 'long' })} / ${year}`;

      // Use the plot price from database, fallback to 120 if null
      const annualFee = plot.price || 120;
      const total = annualFee;

      // Encabezado
      doc.setFontSize(11);
      doc.text('ASSOCIACIÓ D\'USUARIS DE LES HORTES DE SANTA EUGÈNIA', 105, 15, { align: 'center' });
      doc.text('e-mail ........ masmarria2009@gmail.com', 105, 22, { align: 'center' });
      doc.text('Can Po Vell telèfon. 679750654 (tardes)', 105, 28, { align: 'center' });
      doc.text('NIF G55066021', 105, 34, { align: 'center' });

      doc.setFontSize(10);
      doc.text(`Ref. ${plot.location} - ${plot.number}`, 14, 45);

      // Datos del usuario
      doc.text(`${plot.member.name}`, 140, 45);
      if (plot.member.address) {
        doc.text(`${plot.member.address}`, 140, 50);
      }

      // Cuerpo
      doc.setFontSize(11);
      const body = [
        `L'Associació d'Usuaris de les Hortes de Sta. Eugènia rep de part del/la titular`,
        `${plot.member.name}, amb NIF/NIE ${plot.member.dni || 'N/A'}, la quantitat de ${total}€`,
        `en concepte de lloguer per a l'any ${year} de la parcel·la núm. ${plot.number} de la`,
        `matriu ${plot.location} de ${plot.size} m².`,
        ``,
        `La concessió es renovarà anualment. Prorrogable sempre que es compleixi la`,
        `normativa i els estatuts de l'Associació. En cas d'incompliment l'adjudicatari/a`,
        `perdrà els drets d'ús de la parcel·la i la seva condició de soci/a.`,
        ``,
        `Al cessar com a soci/a, per renúncia o pèrdua dels drets, s'abonarà la fiança amb el`,
        `retorn de la clau.`,
      ];

      let y = 70;
      body.forEach(line => {
        doc.text(line, 14, y);
        y += 7;
      });

      // Firma
      doc.text('El President', 14, y + 15);
      doc.text(dateText, 14, y + 35);

      doc.save(`contracte-hort-${plot.member.name}-${year}.pdf`);
      
      toast.success('Contracte PDF generat i descarregat exitosament');
      return { data: { fileName: `contracte-hort-${plot.member.name}-${year}.pdf` }, error: null };
    } catch (error) {
      console.error('Error generating rental contract:', error);
      toast.error('Error al generar el contracte PDF');
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
