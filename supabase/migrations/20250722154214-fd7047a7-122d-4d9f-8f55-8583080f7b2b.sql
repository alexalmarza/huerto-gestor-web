-- Añadir campos de código postal y ciudad a la tabla members
ALTER TABLE public.members 
ADD COLUMN postal_code VARCHAR(5),
ADD COLUMN city TEXT;

-- Crear índice para el código postal para mejorar consultas
CREATE INDEX idx_members_postal_code ON public.members(postal_code);

-- Crear índice para la ciudad
CREATE INDEX idx_members_city ON public.members(city);