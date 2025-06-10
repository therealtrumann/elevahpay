
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Transaction } from "@/hooks/useTransactions";

interface SaleDetailsModalProps {
  sale: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaleDetailsModal({ sale, open, onOpenChange }: SaleDetailsModalProps) {
  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-background border border-border">
        <DialogHeader>
          <DialogTitle>Detalhes da Venda</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Produto</Label>
            <p className="text-foreground">{sale.products?.name || 'N/A'}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Data da Transação</Label>
            <p className="text-foreground">{new Date(sale.created_at).toLocaleDateString('pt-BR')}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Parcela</Label>
            <p className="text-foreground font-medium">
              Parcela {sale.installment_number} de {sale.total_installments}
            </p>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Valor Total</Label>
            <p className="text-foreground font-medium">
              R$ {(sale.total_cents / 100).toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Taxa ({sale.fee_percent}% + R${(sale.fee_fixed_cents / 100).toFixed(2)})</Label>
            <p className="text-red-600 font-medium">
              - R$ {((sale.total_cents * sale.fee_percent / 100 + sale.fee_fixed_cents) / 100).toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Valor Líquido Recebido</Label>
            <p className="text-green-600 font-bold text-lg">
              R$ {(sale.net_cents / 100).toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
            <p className={`font-medium ${
              sale.status === 'approved' ? 'text-green-600' :
              sale.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {sale.status === 'approved' ? 'Aprovado' :
               sale.status === 'pending' ? 'Pendente' : 'Cancelado'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
