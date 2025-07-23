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
  price?: number | null;
  member?: {
    first_name: string;
    last_name: string | null;
    dni: string;
    address: string;
  };
}

export interface CreatePlotData {
  number: string;
  size: string;
  location: string;
  price?: number;
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
          member:members!assigned_member_id(first_name, last_name, dni, address)
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
          member:members!assigned_member_id(first_name, last_name, dni, address)
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
    if (!plot.member?.first_name || !plot.assigned_date) {
      toast.error('No es pot generar el contracte: manca informació');
      return { data: null, error: 'Falta informació d\'assignació' };
    }

    const doc = new jsPDF();
    const today = new Date();
    const year = today.getFullYear();
    const dateText = `Girona, ${today.getDate()} / ${today.toLocaleString('ca-ES', { month: 'long' })} / ${year}`;
    const annualFee = plot.price || 120;
    const total = annualFee;

    // 🖼️ Logo como base64 directo (funciona 100%)
    // Imagen simple de logo en PNG base64 que definitivamente funciona
    const imageData = 'data:image/png;base64,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';
    
    console.log('Usando logo base64 directo');

    // 📌 Márgenes y posiciones
    const marginLeft = 20;
    const rightColumnX = 140;
    let y = 15;

    // 🖼️ Insertar logo (más grande y visible) - solo si se cargó correctamente
    if (imageData) {
      console.log('Añadiendo imagen al PDF con dimensiones 50x30...');
      try {
        // Detectar el formato de la imagen desde el data URL
        const format = imageData.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        console.log('Formato detectado:', format);
        
        // Hacer el logo más grande y añadir un borde para debug
        doc.addImage(imageData, format, marginLeft, y, 50, 30);
        
        // Añadir un rectángulo alrededor para verificar la posición (solo para debug)
        doc.setDrawColor(255, 0, 0); // Color rojo para debug
        doc.rect(marginLeft, y, 50, 30);
        
        console.log('Imagen añadida exitosamente con marco rojo');
        y += 35; // Más espacio después del logo
      } catch (error) {
        console.error('Error añadiendo imagen:', error);
        // Si hay error, continuar sin logo
      }
    } else {
      // Si no hay logo, continuamos con el texto normalmente
      console.log('Generando PDF sin logo - imageData es null');
    }

    // 🧾 Encabezado
    doc.setFontSize(11);
    doc.text('ASSOCIACIÓ D\'USUARIS DE LES HORTES DE SANTA EUGÈNIA', 105, y, { align: 'center' });
    y += 7;
    doc.text('e-mail ........ masmarria2009@gmail.com', 105, y, { align: 'center' });
    y += 6;
    doc.text('Can Po Vell telèfon. 679750654 (tardes)', 105, y, { align: 'center' });
    y += 6;
    doc.text('NIF G55066021', 105, y, { align: 'center' });
    y += 10;

    doc.setFontSize(10);
    doc.text(`Ref. ${plot.location} - ${plot.number}`, marginLeft, y);
    doc.text(`${plot.member.first_name} ${plot.member.last_name || ''}`, rightColumnX, y);
    y += 5;
    doc.text(`${plot.member.address}`, rightColumnX, y);
    // doc.text(`${plot.member.cp} - GIRONA`, rightColumnX, y + 5); // si quieres el CP

    y += 15;
    doc.setFontSize(11);

    // 📄 Cuerpo
    const body = [
      `L'Associació d'Usuaris de les Hortes de Sta. Eugènia rep de part del/la titular`,
      `${plot.member.first_name} ${plot.member.last_name || ''}, amb NIF/NIE ${plot.member.dni}, la quantitat de ${total}€`,
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

    body.forEach(line => {
      doc.text(line, marginLeft, y);
      y += 7;
    });

    // ✍️ Firma
    y += 20;
    doc.text('El President', marginLeft, y);
    doc.text(dateText, marginLeft, y + 20);

    // 💾 Guardar
    doc.save(`contracte-hort-${plot.member.first_name}-${plot.member.last_name || ''}-${year}.pdf`);
  } catch (error) {
    console.error(error);
    toast.error('Error generant el PDF');
    return { data: null, error };
  }
};


/*
  const generateRentalContractPDF = async (plot: Plot) => {
      try {
        if (!plot.member?.first_name || !plot.assigned_date) {
          toast.error('No es pot generar el contracte: manca informació');
          return { data: null, error: 'Falta informació d\'assignació' };
        }

        const doc = new jsPDF();
        const today = new Date();
        const year = today.getFullYear();
        const dateText = `Girona, ${today.getDate()} / ${today.toLocaleString('ca-ES', { month: 'long' })} / ${year}`;

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
        doc.text(`${plot.member.first_name} ${plot.member.last_name || ''}`, 140, 45);
        doc.text(`${plot.member.address}`, 140, 50);
      //  doc.text(`${plot.member.cp} - GIRONA`, 140, 55);

        // Cuerpo
        doc.setFontSize(11);
        const body = [
          `L'Associació d'Usuaris de les Hortes de Sta. Eugènia rep de part del/la titular`,
          `${plot.member.first_name} ${plot.member.last_name || ''}, amb NIF/NIE ${plot.member.dni}, la quantitat de ${total}€`,
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

    doc.save(`contracte-hort-${plot.member.first_name}-${plot.member.last_name || ''}-${year}.pdf`);
  } catch (error) {
    console.error(error);
    toast.error('Error generant el PDF');
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
