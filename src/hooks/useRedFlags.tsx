
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RedFlag {
  id: string;
  entity_type: 'member' | 'plot';
  entity_id: string;
  reason: string;
  description: string | null;
  flagged_by: string | null;
  flagged_at: string;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRedFlagData {
  entity_type: 'member' | 'plot';
  entity_id: string;
  reason: string;
  description?: string;
}

export const useRedFlags = () => {
  const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRedFlags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('red_flags')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRedFlags((data || []) as RedFlag[]);
    } catch (error) {
      console.error('Error fetching red flags:', error);
      toast.error('Error al cargar las red flags');
    } finally {
      setLoading(false);
    }
  };

  const getEntityRedFlags = async (entityType: 'member' | 'plot', entityId: string) => {
    try {
      const { data, error } = await supabase
        .from('red_flags')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: (data || []) as RedFlag[], error: null };
    } catch (error) {
      console.error('Error fetching entity red flags:', error);
      return { data: [], error };
    }
  };

  const createRedFlag = async (redFlagData: CreateRedFlagData) => {
    try {
      const { data, error } = await supabase
        .from('red_flags')
        .insert([redFlagData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchRedFlags(); // Refresh the list
      toast.success('Red flag creada exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating red flag:', error);
      toast.error('Error al crear la red flag');
      return { data: null, error };
    }
  };

  const resolveRedFlag = async (redFlagId: string, resolvedBy: string = 'admin') => {
    try {
      const { data, error } = await supabase
        .from('red_flags')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy
        })
        .eq('id', redFlagId)
        .select()
        .single();

      if (error) throw error;
      
      await fetchRedFlags(); // Refresh the list
      toast.success('Red flag resuelta exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error resolving red flag:', error);
      toast.error('Error al resolver la red flag');
      return { data: null, error };
    }
  };

  const deleteRedFlag = async (redFlagId: string) => {
    try {
      const { error } = await supabase
        .from('red_flags')
        .delete()
        .eq('id', redFlagId);

      if (error) throw error;
      
      await fetchRedFlags(); // Refresh the list
      toast.success('Red flag eliminada exitosamente');
      return { error: null };
    } catch (error) {
      console.error('Error deleting red flag:', error);
      toast.error('Error al eliminar la red flag');
      return { error };
    }
  };

  useEffect(() => {
    fetchRedFlags();
  }, []);

  return {
    redFlags,
    loading,
    createRedFlag,
    resolveRedFlag,
    deleteRedFlag,
    getEntityRedFlags,
    refetch: fetchRedFlags
  };
};
