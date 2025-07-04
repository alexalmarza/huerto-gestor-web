
-- Crear tabla de incidencias
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de relación entre miembros e incidencias
CREATE TABLE public.member_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(member_id, incident_id)
);

-- Crear tabla de relación entre parcelas e incidencias
CREATE TABLE public.plot_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE NOT NULL,
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(plot_id, incident_id)
);

-- Modificar la tabla members para permitir múltiples motivos de desactivación
ALTER TABLE public.members 
DROP CONSTRAINT IF EXISTS check_deactivation_fields,
ADD COLUMN deactivation_reasons TEXT[] DEFAULT NULL;

-- Actualizar el constraint para usar el nuevo campo de array
ALTER TABLE public.members 
ADD CONSTRAINT check_deactivation_fields 
CHECK (
  (is_active = true AND deactivation_date IS NULL AND deactivation_reasons IS NULL) OR
  (is_active = false AND deactivation_date IS NOT NULL AND deactivation_reasons IS NOT NULL AND array_length(deactivation_reasons, 1) > 0)
);

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plot_incidents ENABLE ROW LEVEL SECURITY;

-- Políticas RLS permisivas para todas las tablas de incidencias
CREATE POLICY "Enable all for incidents" ON public.incidents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for member_incidents" ON public.member_incidents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for plot_incidents" ON public.plot_incidents FOR ALL USING (true) WITH CHECK (true);

-- Crear función para desasignar parcelas automáticamente cuando un miembro se desactiva
CREATE OR REPLACE FUNCTION public.handle_member_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el socio se está desactivando
  IF NEW.is_active = false AND OLD.is_active = true THEN
    -- Establecer la fecha de baja si no se proporciona
    IF NEW.deactivation_date IS NULL THEN
      NEW.deactivation_date = CURRENT_DATE;
    END IF;
    
    -- Desasignar todas las parcelas del socio
    UPDATE public.plots 
    SET assigned_member_id = NULL, 
        assigned_date = NULL, 
        status = 'disponible'
    WHERE assigned_member_id = NEW.id;
  END IF;
  
  -- Si el socio se está reactivando, limpiar los campos de baja
  IF NEW.is_active = true AND OLD.is_active = false THEN
    NEW.deactivation_date = NULL;
    NEW.deactivation_reasons = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_member_incidents_member_id ON public.member_incidents(member_id);
CREATE INDEX idx_member_incidents_incident_id ON public.member_incidents(incident_id);
CREATE INDEX idx_plot_incidents_plot_id ON public.plot_incidents(plot_id);
CREATE INDEX idx_plot_incidents_incident_id ON public.plot_incidents(incident_id);
