
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Withdrawal {
  id: string;
  user_id: string;
  amount_cents: number;
  status: string;
  requested_at: string;
  processed_at?: string;
}

export function useWithdrawals() {
  return useQuery({
    queryKey: ['withdrawals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .order('requested_at', { ascending: false });
      
      if (error) throw error;
      return data as Withdrawal[];
    },
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (amountCents: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('withdrawals')
        .insert([{
          user_id: user.id,
          amount_cents: amountCents,
          status: 'requested'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      toast({
        title: "Saque solicitado!",
        description: "Sua solicitação foi enviada com sucesso.",
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
