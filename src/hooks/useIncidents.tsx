
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Incident {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateIncidentData {
  title: string;
  description?: string;
}

export interface MemberIncident {
  id: string;
  member_id: string;
  incident_id: string;
  created_at: string;
  incident: Incident;
}

export interface PlotIncident {
  id: string;
  plot_id: string;
  incident_id: string;
  created_at: string;
  incident: Incident;
}

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      toast.error('Error al cargar las incidencias');
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async (incidentData: CreateIncidentData) => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .insert([{
          title: incidentData.title,
          description: incidentData.description || null
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchIncidents(); // Refrescar la lista
      toast.success('Incidencia creada exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating incident:', error);
      toast.error('Error al crear la incidencia');
      return { data: null, error };
    }
  };

  const getMemberIncidents = async (memberId: string) => {
    try {
      const { data, error } = await supabase
        .from('member_incidents')
        .select(`
          *,
          incident:incidents(*)
        `)
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching member incidents:', error);
      return { data: [], error };
    }
  };

  const getPlotIncidents = async (plotId: string) => {
    try {
      const { data, error } = await supabase
        .from('plot_incidents')
        .select(`
          *,
          incident:incidents(*)
        `)
        .eq('plot_id', plotId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching plot incidents:', error);
      return { data: [], error };
    }
  };

  const addPlotIncident = async (plotId: string, incidentId: string) => {
    try {
      const { data, error } = await supabase
        .from('plot_incidents')
        .insert([{
          plot_id: plotId,
          incident_id: incidentId
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Incidencia asociada a la parcela exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error adding plot incident:', error);
      toast.error('Error al asociar la incidencia a la parcela');
      return { data: null, error };
    }
  };

  const addMemberIncident = async (memberId: string, incidentId: string) => {
    try {
      const { data, error } = await supabase
        .from('member_incidents')
        .insert([{
          member_id: memberId,
          incident_id: incidentId
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Incidencia asociada al socio exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error adding member incident:', error);
      toast.error('Error al asociar la incidencia al socio');
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return {
    incidents,
    loading,
    createIncident,
    getMemberIncidents,
    getPlotIncidents,
    addPlotIncident,
    addMemberIncident,
    refetch: fetchIncidents
  };
};
