
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
import { useToast } from "@/hooks/use-toast";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const availableBalance = 8750.00;

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    
    if (!amount || withdrawAmount <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, informe um valor válido.",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount < 50) {
      toast({
        title: "Erro",
        description: "O valor mínimo para saque é R$ 50,00.",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast({
        title: "Erro",
        description: "Valor superior ao saldo disponível.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Saque solicitado!",
      description: `Sua solicitação de saque de R$ ${withdrawAmount.toFixed(2).replace('.', ',')} foi enviada.`,
    });

    setAmount("");
    onOpenChange(false);
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
              R$ {availableBalance.toFixed(2).replace('.', ',')}
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
              max={availableBalance}
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
            <Button onClick={handleWithdraw} className="flex-1 bg-green-600 hover:bg-green-700">
              Solicitar Saque
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
