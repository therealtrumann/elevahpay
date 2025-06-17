
-- Create a table for PIX transactions
CREATE TABLE public.pix_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id),
  txid TEXT NOT NULL,
  loc_id INTEGER,
  id_rec TEXT,
  valor DECIMAL(10,2) NOT NULL,
  cpf TEXT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  qr_code TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.pix_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert (for webhook/public checkout)
CREATE POLICY "Anyone can create pix transactions" 
  ON public.pix_transactions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows anyone to select (for webhook/public checkout)
CREATE POLICY "Anyone can view pix transactions" 
  ON public.pix_transactions 
  FOR SELECT 
  USING (true);
