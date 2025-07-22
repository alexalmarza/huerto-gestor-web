-- Añadir campo para teléfono fijo
ALTER TABLE public.members 
ADD COLUMN landline_phone TEXT;

-- Crear índice para el teléfono fijo
CREATE INDEX idx_members_landline_phone ON public.members(landline_phone);