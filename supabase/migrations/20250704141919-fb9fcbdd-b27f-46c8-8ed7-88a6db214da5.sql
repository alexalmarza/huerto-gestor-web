
-- Arreglar la función para acumular múltiples motivos de desactivación
CREATE OR REPLACE FUNCTION public.handle_member_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el socio se está desactivando
  IF NEW.is_active = false AND OLD.is_active = true THEN
    -- Establecer la fecha de baja si no se proporciona
    IF NEW.deactivation_date IS NULL THEN
      NEW.deactivation_date = CURRENT_DATE;
    END IF;
    
    -- Si se proporciona deactivation_reason, agregarlo al array existente
    IF NEW.deactivation_reason IS NOT NULL THEN
      -- Solo agregar al array si la columna deactivation_reasons existe
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'deactivation_reasons'
      ) THEN
        -- Si ya hay motivos, agregar el nuevo; si no, crear el array
        IF OLD.deactivation_reasons IS NOT NULL THEN
          NEW.deactivation_reasons = OLD.deactivation_reasons || ARRAY[NEW.deactivation_reason];
        ELSE
          NEW.deactivation_reasons = ARRAY[NEW.deactivation_reason];
        END IF;
      END IF;
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
    -- Solo limpiar deactivation_reasons si la columna existe
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'members' 
      AND column_name = 'deactivation_reasons'
    ) THEN
      NEW.deactivation_reasons = NULL;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
