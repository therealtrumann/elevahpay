
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Transaction {
  id: string;
  user_id: string;
  product_id: string;
  customer_id?: string;
  total_cents: number;
  fee_percent: number;
  fee_fixed_cents: number;
  net_cents: number;
  installment_number: number;
  total_installments: number;
  status: string;
  created_at: string;
  products?: {
    name: string;
    price_cents: number;
    installments: number;
  };
}

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          products:product_id (
            name,
            price_cents,
            installments
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    },
  });
}

export function useStartCheckout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: string) => {
      // First get the product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (productError) throw productError;

      // Calculate values
      const totalCents = product.price_cents;
      const feePercent = 3.99;
      const feeFixedCents = 200;
      const netCents = Math.floor(totalCents * (1 - feePercent / 100) - feeFixedCents);

      // Create transaction
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          product_id: productId,
          total_cents: totalCents,
          fee_percent: feePercent,
          fee_fixed_cents: feeFixedCents,
          net_cents: netCents,
          installment_number: 1,
          total_installments: product.installments,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Checkout iniciado!",
        description: "Transação criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
