
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
          member:members(name)
        `)
        .order('number');

      if (error) throw error;
      setPlots(data || []);
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
      
      setPlots(prev => [...prev, data]);
      toast.success('Parcela creada exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating plot:', error);
      toast.error('Error al crear la parcela');
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

      setPlots(prev => prev.map(plot => plot.id === id ? data : plot));
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

      setPlots(prev => prev.filter(plot => plot.id !== id));
      toast.success('Parcela eliminada exitosamente');
      return { error: null };
    } catch (error) {
      console.error('Error deleting plot:', error);
      toast.error('Error al eliminar la parcela');
      return { error };
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  return {
    plots,
    loading,
    createPlot,
    updatePlot,
    deletePlot,
    refetch: fetchPlots
  };
};
