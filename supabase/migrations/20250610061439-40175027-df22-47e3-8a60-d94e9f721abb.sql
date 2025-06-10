
-- Criar bucket para imagens de produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Política para permitir que usuários vejam todas as imagens (público)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Política para permitir que usuários autenticados façam upload
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

-- Política para permitir que usuários atualizem suas próprias imagens
CREATE POLICY "Users can update own images" ON storage.objects FOR UPDATE 
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política para permitir que usuários deletem suas próprias imagens
CREATE POLICY "Users can delete own images" ON storage.objects FOR DELETE 
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Corrigir constraint da tabela products para referenciar auth.users corretamente
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_user_id_fkey;
ALTER TABLE public.products ADD CONSTRAINT products_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
