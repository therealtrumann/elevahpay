
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateWithdrawal } from "@/hooks/useWithdrawals";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
}

export function WithdrawModal({ open, onOpenChange, availableBalance }: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const createWithdrawal = useCreateWithdrawal();

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (!amount || withdrawAmount <= 0) {
      return;
    }

    if (withdrawAmount < 50) {
      return;
    }

    if (withdrawAmount * 100 > availableBalance) {
      return;
    }

    try {
      await createWithdrawal.mutateAsync(Math.round(withdrawAmount * 100));
      setAmount("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating withdrawal:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-background border border-border">
        <DialogHeader>
          <DialogTitle>Solicitar Saque</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Saldo disponível</p>
            <p className="text-2xl font-bold text-green-600">
              R$ {(availableBalance / 100).toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div>
            <Label htmlFor="amount">Valor do Saque (R$)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              step="0.01"
              min="50"
              max={availableBalance / 100}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Valor mínimo: R$ 50,00
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Informações do Saque</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Processamento em até 2 dias úteis</li>
              <li>• Transferência via PIX ou TED</li>
              <li>• Sem taxas adicionais</li>
            </ul>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleWithdraw} 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={createWithdrawal.isPending}
            >
              {createWithdrawal.isPending ? "Solicitando..." : "Solicitar Saque"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
