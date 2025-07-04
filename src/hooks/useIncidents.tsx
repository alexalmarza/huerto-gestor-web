
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
}

export interface PlotIncident {
  id: string;
  plot_id: string;
  incident_id: string;
  created_at: string;
}

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      // For now, we'll use a placeholder since the incidents table isn't in the types yet
      console.log('Incidents feature will be available once database types are updated');
      setIncidents([]);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      toast.error('Error al cargar las incidencias');
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async (incidentData: CreateIncidentData) => {
    try {
      console.log('Creating incident:', incidentData);
      toast.success('Funcionalidad de incidencias disponible próximamente');
      return { data: { id: 'temp-id', ...incidentData, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), description: incidentData.description || null }, error: null };
    } catch (error) {
      console.error('Error creating incident:', error);
      toast.error('Error al crear la incidencia');
      return { data: null, error };
    }
  };

  const getMemberIncidents = async (memberId: string) => {
    try {
      console.log('Getting member incidents for:', memberId);
      return { data: [], error: null };
    } catch (error) {
      console.error('Error fetching member incidents:', error);
      return { data: [], error };
    }
  };

  const getPlotIncidents = async (plotId: string) => {
    try {
      console.log('Getting plot incidents for:', plotId);
      return { data: [], error: null };
    } catch (error) {
      console.error('Error fetching plot incidents:', error);
      return { data: [], error };
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
    refetch: fetchIncidents
  };
};
