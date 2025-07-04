
-- Agregar campos para manejar el estado de los socios
ALTER TABLE public.members 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN deactivation_date DATE,
ADD COLUMN deactivation_reason TEXT;

-- Crear índice para consultas de socios activos/inactivos
CREATE INDEX idx_members_is_active ON public.members(is_active);

-- Agregar constraint para asegurar que si un socio está inactivo, debe tener fecha y motivo de baja
ALTER TABLE public.members 
ADD CONSTRAINT check_deactivation_fields 
CHECK (
  (is_active = true AND deactivation_date IS NULL AND deactivation_reason IS NULL) OR
  (is_active = false AND deactivation_date IS NOT NULL AND deactivation_reason IS NOT NULL)
);

-- Agregar constraint para asegurar que un socio solo puede tener una parcela asignada
-- Esto se logra mediante la foreign key única que ya existe en plots.assigned_member_id
-- Pero agregamos un índice único para mejorar el rendimiento
CREATE UNIQUE INDEX idx_plots_unique_assigned_member ON public.plots(assigned_member_id) 
WHERE assigned_member_id IS NOT NULL;

-- Actualizar el trigger para manejar la fecha de actualización cuando se cambia el estado
CREATE OR REPLACE FUNCTION public.handle_member_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el socio se está desactivando, establecer la fecha de baja si no se proporciona
  IF NEW.is_active = false AND OLD.is_active = true AND NEW.deactivation_date IS NULL THEN
    NEW.deactivation_date = CURRENT_DATE;
  END IF;
  
  -- Si el socio se está reactivando, limpiar los campos de baja
  IF NEW.is_active = true AND OLD.is_active = false THEN
    NEW.deactivation_date = NULL;
    NEW.deactivation_reason = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para manejar automáticamente la desactivación/reactivación
CREATE TRIGGER trigger_member_deactivation
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.handle_member_deactivation();
