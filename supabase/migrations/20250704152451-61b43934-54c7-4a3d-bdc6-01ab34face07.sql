
-- Crear tabla para almacenar las red flags
CREATE TABLE public.red_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('member', 'plot')),
  entity_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  flagged_by TEXT DEFAULT 'admin',
  flagged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.red_flags ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS para red flags
CREATE POLICY "Enable all for red_flags" 
  ON public.red_flags 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_red_flags_entity_type ON public.red_flags(entity_type);
CREATE INDEX idx_red_flags_entity_id ON public.red_flags(entity_id);
CREATE INDEX idx_red_flags_resolved ON public.red_flags(resolved);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_red_flags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_red_flags_updated_at_trigger
  BEFORE UPDATE ON public.red_flags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_red_flags_updated_at();
