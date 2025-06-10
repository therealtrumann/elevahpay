
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
