
-- Crear tabla para los pagos
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('parcela', 'material', 'alquiler')),
  plot_id UUID REFERENCES public.plots(id) ON DELETE SET NULL,
  concept TEXT,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  receipt_number TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS para pagos
CREATE POLICY "Enable all for payments" 
  ON public.payments 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Función para generar número de recibo automáticamente
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.receipt_number = 'REC-' || NEW.payment_year || '-' ||
    LPAD((
      SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_number FROM 'REC-' || NEW.payment_year || '-(.*)') AS INTEGER)), 0) + 1
      FROM public.payments 
      WHERE payment_year = NEW.payment_year
    )::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar número de recibo
CREATE TRIGGER generate_receipt_number_trigger
  BEFORE INSERT ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_receipt_number();

-- Índices para mejorar el rendimiento
CREATE INDEX idx_payments_member_id ON public.payments(member_id);
CREATE INDEX idx_payments_plot_id ON public.payments(plot_id);
CREATE INDEX idx_payments_payment_year ON public.payments(payment_year);
CREATE INDEX idx_payments_payment_type ON public.payments(payment_type);
