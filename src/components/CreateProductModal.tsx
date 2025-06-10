
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";
import { useCreateProduct } from "@/hooks/useProducts";

interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProductModal({ open, onOpenChange }: CreateProductModalProps) {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    installments: "1",
    pixAutomatic: false,
    recurringCard: false,
  });
  
  const createProduct = useCreateProduct();

  const handleCreate = async () => {
    if (!productData.name || !productData.price) {
      return;
    }

    if (!productData.pixAutomatic && !productData.recurringCard) {
      return;
    }

    try {
      await createProduct.mutateAsync({
        name: productData.name,
        description: productData.description,
        price_cents: Math.round(parseFloat(productData.price) * 100),
        installments: parseInt(productData.installments),
        is_recurring: productData.recurringCard,
      });

      setProductData({
        name: "",
        description: "",
        price: "",
        installments: "1",
        pixAutomatic: false,
        recurringCard: false,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border border-border">
        <DialogHeader>
          <DialogTitle>Criar Novo Produto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              placeholder="Ex: Curso de Marketing Digital"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              placeholder="Descreva seu produto..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image">Imagem do Produto</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Clique para fazer upload ou arraste a imagem aqui
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG até 5MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                placeholder="0,00"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="installments">Quantidade de Cobranças</Label>
              <Select value={productData.installments} onValueChange={(value) => setProductData({ ...productData, installments: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Métodos de Pagamento *</Label>
            <div className="space-y-3 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pix"
                  checked={productData.pixAutomatic}
                  onCheckedChange={(checked) => setProductData({ ...productData, pixAutomatic: checked as boolean })}
                />
                <Label htmlFor="pix" className="cursor-pointer">
                  Pix Automático
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="card"
                  checked={productData.recurringCard}
                  onCheckedChange={(checked) => setProductData({ ...productData, recurringCard: checked as boolean })}
                />
                <Label htmlFor="card" className="cursor-pointer">
                  Cartão Recorrente
                </Label>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleCreate} 
              className="flex-1"
              disabled={createProduct.isPending}
            >
              {createProduct.isPending ? "Criando..." : "Criar Produto"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
