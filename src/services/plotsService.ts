import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plot, CreatePlotData, AssignPlotData } from '@/hooks/usePlots';

export const fetchPlots = async (): Promise<Plot[]> => {
  console.log('Fetching plots...'); // Debug log
  
  const { data, error } = await supabase
    .from('plots')
    .select(`
      *,
      member:members!assigned_member_id(first_name, last_name, dni, address)
    `)
    .order('number', { ascending: true });

  if (error) {
    console.error('Error fetching plots:', error);
    throw error;
  }
  
  console.log('All plots fetched:', data); // Debug log to see all data
  console.log('Number of plots:', data?.length || 0); // Debug log
  
  return (data || []) as Plot[];
};

export const createPlot = async (plotData: CreatePlotData) => {
  const { data, error } = await supabase
    .from('plots')
    .insert([plotData])
    .select()
    .single();

  if (error) throw error;
  
  toast.success('Parcela creada exitosamente');
  return { data, error: null };
};

export const assignPlot = async (plotId: string, assignData: AssignPlotData) => {
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
      member:members!assigned_member_id(first_name, last_name)
    `)
    .single();

  if (error) throw error;

  console.log('Plot assigned successfully:', data); // Debug log
  
  toast.success('Parcela asignada exitosamente');
  return { data, error: null };
};

export const unassignPlot = async (plotId: string) => {
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
  
  toast.success('Parcela liberada exitosamente');
  return { data, error: null };
};

export const updatePlot = async (id: string, updates: Partial<Plot>) => {
  const { data, error } = await supabase
    .from('plots')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  toast.success('Parcela actualizada exitosamente');
  return { data, error: null };
};

export const deletePlot = async (id: string) => {
  const { error } = await supabase
    .from('plots')
    .delete()
    .eq('id', id);

  if (error) throw error;

  toast.success('Parcela eliminada exitosamente');
  return { error: null };
};
