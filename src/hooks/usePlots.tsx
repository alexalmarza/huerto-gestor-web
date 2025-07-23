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

    // 🖼️ Usar una imagen de prueba primero para verificar que jsPDF funciona
    // Imagen de prueba en base64 (un pequeño cuadrado azul)
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    // Intentar cargar el logo real
    const imageUrl = '/images/logoHortes1.jpg';
    let imageData = testImageData; // Usar imagen de prueba por defecto
    
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const blob = await response.blob();
        
        // Verificar el tipo de archivo
        console.log('Tipo de archivo:', blob.type);
        
        // Convertir a base64
        const realImageData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            console.log('Base64 generado, tamaño:', result.length, 'primeros chars:', result.substring(0, 50));
            resolve(result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        
        imageData = realImageData; // Usar la imagen real si se carga correctamente
        console.log('Logo real cargado correctamente para PDF');
      } else {
        console.error('Error cargando logo, usando imagen de prueba:', response.status);
      }
    } catch (error) {
      console.error('Error fetching logo, usando imagen de prueba:', error);
    }

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
