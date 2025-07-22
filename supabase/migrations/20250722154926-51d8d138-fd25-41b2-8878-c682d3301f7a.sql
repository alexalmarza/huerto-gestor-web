-- Añadir campo apellidos (last_name) a la tabla members
ALTER TABLE public.members 
ADD COLUMN last_name TEXT;

-- Renombrar el campo name a first_name para mayor claridad
ALTER TABLE public.members 
RENAME COLUMN name TO first_name;

-- Crear índice para búsquedas por apellidos
CREATE INDEX idx_members_last_name ON public.members(last_name);

-- Crear índice compuesto para búsquedas por nombre completo
CREATE INDEX idx_members_full_name ON public.members(first_name, last_name);