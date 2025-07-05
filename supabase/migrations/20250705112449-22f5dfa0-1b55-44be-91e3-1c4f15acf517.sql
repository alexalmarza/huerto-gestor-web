
-- Agregar el campo price a la tabla plots
ALTER TABLE public.plots 
ADD COLUMN price NUMERIC(10,2) DEFAULT 120.00;

-- Comentario: Agregamos un precio por defecto de 120€ que parece ser el estándar según el código actual
