
-- Actualizar los tipos de base de datos para incluir las nuevas tablas de incidencias
-- Asegurarnos de que las tablas existan y estén correctamente configuradas

-- Verificar que las tablas de incidencias existan
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'incidents') THEN
        CREATE TABLE public.incidents (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Enable all for incidents" ON public.incidents FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'member_incidents') THEN
        CREATE TABLE public.member_incidents (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
            incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            UNIQUE(member_id, incident_id)
        );
        
        ALTER TABLE public.member_incidents ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Enable all for member_incidents" ON public.member_incidents FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'plot_incidents') THEN
        CREATE TABLE public.plot_incidents (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE NOT NULL,
            incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            UNIQUE(plot_id, incident_id)
        );
        
        ALTER TABLE public.plot_incidents ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Enable all for plot_incidents" ON public.plot_incidents FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Actualizar la función de desactivación para manejar correctamente el array de razones
CREATE OR REPLACE FUNCTION public.handle_member_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el socio se está desactivando
  IF NEW.is_active = false AND OLD.is_active = true THEN
    -- Establecer la fecha de baja si no se proporciona
    IF NEW.deactivation_date IS NULL THEN
      NEW.deactivation_date = CURRENT_DATE;
    END IF;
    
    -- Si se proporciona deactivation_reason, convertirlo a array
    IF NEW.deactivation_reason IS NOT NULL AND (NEW.deactivation_reasons IS NULL OR array_length(NEW.deactivation_reasons, 1) IS NULL) THEN
      NEW.deactivation_reasons = ARRAY[NEW.deactivation_reason];
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
    NEW.deactivation_reason = NULL;
    NEW.deactivation_reasons = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_member_incidents_member_id ON public.member_incidents(member_id);
CREATE INDEX IF NOT EXISTS idx_member_incidents_incident_id ON public.member_incidents(incident_id);
CREATE INDEX IF NOT EXISTS idx_plot_incidents_plot_id ON public.plot_incidents(plot_id);
CREATE INDEX IF NOT EXISTS idx_plot_incidents_incident_id ON public.plot_incidents(incident_id);
