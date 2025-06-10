
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SaleDetailsModalProps {
  sale: any;
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
            <Label className="text-sm font-medium text-muted-foreground">Nome do Comprador</Label>
            <p className="text-foreground">{sale.buyer.name}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">E-mail</Label>
            <p className="text-foreground">{sale.buyer.email}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
            <p className="text-foreground">{sale.buyer.phone}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Parcela</Label>
            <p className="text-foreground font-medium">
              Parcela {sale.installment.current} de {sale.installment.total}
            </p>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Valor Pago</Label>
            <p className="text-foreground font-medium">
              R$ {sale.buyer.paidValue.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Taxa (3,99% + R$2)</Label>
            <p className="text-red-600 font-medium">
              - R$ {sale.buyer.fee.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Valor Líquido Recebido</Label>
            <p className="text-green-600 font-bold text-lg">
              R$ {sale.netValue.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
