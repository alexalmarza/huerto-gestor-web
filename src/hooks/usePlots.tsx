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
/*
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
      doc.text('ASSOCIACIÓ D’USUARIS DE  LES HORTES DE SANTA EUGÈNIA ' + 
               ' e-mail   .........   masmarria2009@gmail.com '+
               '  Can Po Vell telèfon. 679750654(tardes)'+
               '  NIF G55066021', 105, 25, { align: 'center' });

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
      });*/

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

        const annualFee = 120;
        const total = annualFee;

        // Encabezado
        doc.setFontSize(11);
        doc.text('ASSOCIACIÓ D’USUARIS DE LES HORTES DE SANTA EUGÈNIA', 105, 15, { align: 'center' });
        doc.text('e-mail ........ masmarria2009@gmail.com', 105, 22, { align: 'center' });
        doc.text('Can Po Vell telèfon. 679750654 (tardes)', 105, 28, { align: 'center' });
        doc.text('NIF G55066021', 105, 34, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`Ref. ${plot.location} - ${plot.number}`, 14, 45);

        // Datos del usuario
        doc.text(`${plot.member.name}`, 140, 45);
        doc.text(`${plot.member.address}`, 140, 50);
      //  doc.text(`${plot.member.cp} - GIRONA`, 140, 55);

        // Cuerpo
        doc.setFontSize(11);
        const body = [
          `L'Associació d'Usuaris de les Hortes de Sta. Eugènia rep de part del/la titular`,
          `${plot.member.name}, amb NIF/NIE ${plot.member.dni}, la quantitat de ${total}€`,
          `en concepte de lloguer per a l'any ${year} de la parcel·la núm. ${plot.number} de la`,
          `matriu ${plot.location} de ${plot.size} m².`,
          ``,
          `La concessió es renovarà anualment. Prorrogable sempre que es compleixi la`,
          `normativa i els estatuts de l'Associació. En cas d'incompliment l'adjudicatari/a`,
          `perdrà els drets d’ús de la parcel·la i la seva condició de soci/a.`,
          ``,
          `Al cessar com a soci/a, per renúncia o pèrdua dels drets, s’abonarà la fiança amb el`,
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
  } catch (error) {
    console.error(error);
    toast.error('Error generant el PDF');
    return { data: null, error };
  }
};
      /*
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
  };*/

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
