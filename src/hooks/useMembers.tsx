
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Member {
  id: string;
  first_name: string;
  last_name: string | null;
  dni: string;
  email: string;
  phone: string | null;
  landline_phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  join_date: string;
  payment_status: 'al día' | 'pendiente' | 'vencido';
  is_active: boolean;
  deactivation_date: string | null;
  deactivation_reason: string | null;
  created_at: string;
  updated_at: string;
  assigned_plot?: {
    id: string;
    number: string;
    size: string;
    location: string;
  };
}

export interface CreateMemberData {
  first_name: string;
  last_name?: string;
  dni: string;
  email: string;
  phone?: string;
  landline_phone?: string;
  address?: string;
  postal_code?: string;
  city?: string;
}

export interface DeactivateMemberData {
  deactivation_reason: string;
}

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          assigned_plot:plots!assigned_member_id(
            id,
            number,
            size,
            location
          )
        `)
        .order('first_name');

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(member => ({
        ...member,
        assigned_plot: member.assigned_plot?.[0] || null
      })) as Member[];
      
      setMembers(transformedData);
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
        .from('members')
        .insert([memberData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchMembers(); // Refrescar la lista completa
      toast.success('Socio creado exitosamente');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating member:', error);
      
      // Handle specific database errors
      if (error?.code === '23505') {
        if (error.message.includes('members_email_key')) {
          toast.error('Ya existe un socio con este email');
        } else if (error.message.includes('members_dni_key')) {
          toast.error('Ya existe un socio con este DNI');
        } else {
          toast.error('Ya existe un socio con estos datos');
        }
      } else {
        toast.error('Error al crear el socio');
      }
      return { data: null, error };
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchMembers(); // Refrescar la lista completa
      toast.success('Socio actualizado exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Error al actualizar el socio');
      return { data: null, error };
    }
  };

  const deactivateMember = async (id: string, deactivationData: DeactivateMemberData) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .update({
          is_active: false,
          deactivation_reason: deactivationData.deactivation_reason
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchMembers(); // Refrescar la lista completa
      toast.success('Socio desactivado exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error deactivating member:', error);
      toast.error('Error al desactivar el socio');
      return { data: null, error };
    }
  };

  const activateMember = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .update({
          is_active: true
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchMembers(); // Refrescar la lista completa
      toast.success('Socio reactivado exitosamente');
      return { data, error: null };
    } catch (error) {
      console.error('Error activating member:', error);
      toast.error('Error al reactivar el socio');
      return { data: null, error };
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchMembers(); // Refrescar la lista completa
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
    deactivateMember,
    activateMember,
    deleteMember,
    refetch: fetchMembers
  };
};
