
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { generateRentalContractPDF } from '@/utils/contractPDFGenerator';
import * as plotsService from '@/services/plotsService';

export interface Plot {
  id: string;
  number: string;
  size: string;
  location: string;
  status: 'ocupada' | 'disponible' | 'mantenimiento';
  assigned_member_id: string | null;
  assigned_date: string | null;
  price: number | null;
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
      const plotsData = await plotsService.fetchPlots();
      console.log('Plots data received in hook:', plotsData); // Debug log
      setPlots(plotsData);
    } catch (error) {
      console.error('Error fetching plots:', error);
      toast.error('Error al cargar las parcelas');
    } finally {
      setLoading(false);
    }
  };

  const createPlot = async (plotData: CreatePlotData) => {
    try {
      const result = await plotsService.createPlot(plotData);
      await fetchPlots(); // Refresh the list
      return result;
    } catch (error) {
      console.error('Error creating plot:', error);
      toast.error('Error al crear la parcela');
      return { data: null, error };
    }
  };

  const assignPlot = async (plotId: string, assignData: AssignPlotData) => {
    try {
      const result = await plotsService.assignPlot(plotId, assignData);
      await fetchPlots(); // Refresh the list
      return result;
    } catch (error) {
      console.error('Error assigning plot:', error);
      toast.error('Error al asignar la parcela');
      return { data: null, error };
    }
  };

  const unassignPlot = async (plotId: string) => {
    try {
      const result = await plotsService.unassignPlot(plotId);
      await fetchPlots(); // Refresh the list
      return result;
    } catch (error) {
      console.error('Error unassigning plot:', error);
      toast.error('Error al liberar la parcela');
      return { data: null, error };
    }
  };

  const updatePlot = async (id: string, updates: Partial<Plot>) => {
    try {
      const result = await plotsService.updatePlot(id, updates);
      await fetchPlots(); // Refresh the list
      return result;
    } catch (error) {
      console.error('Error updating plot:', error);
      toast.error('Error al actualizar la parcela');
      return { data: null, error };
    }
  };

  const deletePlot = async (id: string) => {
    try {
      const result = await plotsService.deletePlot(id);
      await fetchPlots(); // Refresh the list
      return result;
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
    assignPlot,
    unassignPlot,
    updatePlot,
    deletePlot,
    generateRentalContractPDF,
    refetch: fetchPlots
  };
};
