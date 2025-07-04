
-- Create members table
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  dni TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_status TEXT NOT NULL DEFAULT 'pendiente' CHECK (payment_status IN ('al día', 'pendiente', 'vencido')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plots table
CREATE TABLE public.plots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  size TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disponible' CHECK (status IN ('ocupada', 'disponible', 'mantenimiento')),
  assigned_member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  assigned_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for members table
CREATE POLICY "Enable read access for all users" ON public.members FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.members FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.members FOR DELETE USING (true);

-- Create RLS policies for plots table
CREATE POLICY "Enable read access for all users" ON public.plots FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.plots FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.plots FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.plots FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_members_dni ON public.members(dni);
CREATE INDEX idx_members_email ON public.members(email);
CREATE INDEX idx_plots_number ON public.plots(number);
CREATE INDEX idx_plots_assigned_member ON public.plots(assigned_member_id);
