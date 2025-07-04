
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Member {
  id: string;
  name: string;
  dni: string;
  email: string;
  phone: string | null;
  address: string | null;
  join_date: string;
  payment_status: 'al día' | 'pendiente' | 'vencido';
  created_at: string;
  updated_at: string;
}

export interface CreateMemberData {
  name: string;
  dni: string;
  email: string;
  phone?: string;
  address?: string;
}

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('members' as any)
        .select('*')
        .order('name');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Error al cargar los socios');
    } finally {
      setLoading(false);
    }
  };

  const createMember = async (memberData: CreateMemberData) => {
    try {
      const { data, error } = await supabase
        .from('members' as any)
        .insert([memberData])
        .select()
        .single();

      if (error) throw error;
      
      setMembers(prev => [...prev, data]);
      toast.success('Socio creado exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating member:', error);
      toast.error('Error al crear el socio');
      return { data: null, error };
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      const { data, error } = await supabase
        .from('members' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setMembers(prev => prev.map(member => member.id === id ? data : member));
      toast.success('Socio actualizado exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Error al actualizar el socio');
      return { data: null, error };
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMembers(prev => prev.filter(member => member.id !== id));
      toast.success('Socio eliminado exitosamente');
      return { error: null };
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Error al eliminar el socio');
      return { error };
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    createMember,
    updateMember,
    deleteMember,
    refetch: fetchMembers
  };
};
