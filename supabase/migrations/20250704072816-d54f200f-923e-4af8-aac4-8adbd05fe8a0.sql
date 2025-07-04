
-- Crear tabla para parcelas
CREATE TABLE public.plots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number VARCHAR(10) NOT NULL UNIQUE,
  size VARCHAR(20) NOT NULL,
  location VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'disponible' CHECK (status IN ('ocupada', 'disponible', 'mantenimiento')),
  assigned_member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  assigned_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para socios
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  dni VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (payment_status IN ('al día', 'pendiente', 'vencido')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agregar foreign key constraint para plots después de crear members
ALTER TABLE public.plots ADD CONSTRAINT fk_plots_member 
  FOREIGN KEY (assigned_member_id) REFERENCES public.members(id) ON DELETE SET NULL;

-- Habilitar RLS para ambas tablas
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para plots (acceso completo para usuarios autenticados)
CREATE POLICY "Authenticated users can view plots" 
  ON public.plots 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create plots" 
  ON public.plots 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update plots" 
  ON public.plots 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete plots" 
  ON public.plots 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Políticas RLS para members (acceso completo para usuarios autenticados)
CREATE POLICY "Authenticated users can view members" 
  ON public.members 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create members" 
  ON public.members 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update members" 
  ON public.members 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete members" 
  ON public.members 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER plots_updated_at
  BEFORE UPDATE ON public.plots
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insertar algunos datos de ejemplo para plots
INSERT INTO public.plots (number, size, location, status) VALUES
('001', '25m²', 'Sector A', 'disponible'),
('002', '30m²', 'Sector A', 'disponible'),
('003', '25m²', 'Sector A', 'disponible'),
('004', '35m²', 'Sector B', 'disponible'),
('005', '25m²', 'Sector B', 'disponible');

-- Insertar algunos datos de ejemplo para members
INSERT INTO public.members (name, dni, email, phone, address, payment_status) VALUES
('Juan Pérez González', '12345678A', 'juan.perez@email.com', '666123456', 'Calle Mayor, 123, Madrid', 'al día'),
('María García López', '87654321B', 'maria.garcia@email.com', '666789012', 'Avenida Principal, 45, Madrid', 'pendiente'),
('Carlos Rodríguez', '11223344C', 'carlos.rodriguez@email.com', '666345678', 'Plaza España, 8, Madrid', 'al día');
