
import { useState } from "react";
import { Plus, Copy, ExternalLink, Package, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CreateProductModal } from "@/components/CreateProductModal";
import { EditProductModal } from "@/components/EditProductModal";
import { DeleteProductModal } from "@/components/DeleteProductModal";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Products = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { toast } = useToast();

  const products = [
    {
      id: 1,
      name: "Curso de Marketing Digital",
      description: "Aprenda as estratégias mais eficazes do marketing digital",
      price: 297.00,
      installments: 1,
      image: "/placeholder.svg",
      methods: ["Pix Automático", "Cartão"],
      hasSales: false // Produto sem vendas, pode ser editado/excluído
    },
    {
      id: 2,
      name: "Mentoria Mensal",
      description: "Acompanhamento personalizado para seu negócio",
      price: 497.00,
      installments: 12,
      image: "/placeholder.svg",
      methods: ["Cartão"],
      hasSales: true // Produto com vendas, não pode ser editado/excluído
    },
    {
      id: 3,
      name: "E-book de Vendas",
      description: "Guia completo para aumentar suas vendas",
      price: 47.00,
      installments: 1,
      image: "/placeholder.svg",
      methods: ["Pix Automático"],
      hasSales: false // Produto sem vendas, pode ser editado/excluído
    }
  ];

  const copyCheckoutLink = (productId: number, theme: string) => {
    const link = `${window.location.origin}/checkout/${productId}?theme=${theme}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: `Link de checkout (${theme}) copiado para a área de transferência.`,
    });
  };

  const handleEdit = (product) => {
    if (product.hasSales) {
      toast({
        title: "Não é possível editar",
        description: "Este produto já possui vendas e não pode ser editado.",
        variant: "destructive",
      });
      return;
    }
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDelete = (product) => {
    if (product.hasSales) {
      toast({
        title: "Não é possível excluir",
        description: "Este produto já possui vendas e não pode ser excluído.",
        variant: "destructive",
      });
      return;
    }
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
              <p className="text-muted-foreground">Gerencie seus produtos e links de checkout</p>
            </div>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Criar Novo Produto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center flex-1 mr-3">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEdit(product)}
                      disabled={product.hasSales}
                      title={product.hasSales ? "Produto com vendas não pode ser editado" : "Editar produto"}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(product)}
                      disabled={product.hasSales}
                      title={product.hasSales ? "Produto com vendas não pode ser excluído" : "Excluir produto"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                    <Badge variant="secondary">
                      {product.installments}x parcela{product.installments > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Métodos aceitos:</p>
                  <div className="flex flex-wrap gap-1">
                    {product.methods.map((method) => (
                      <Badge key={method} variant="outline" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Link
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-popover border border-border">
                      <DropdownMenuItem onClick={() => copyCheckoutLink(product.id, "white")}>
                        <div className="w-4 h-4 bg-white border border-gray-300 rounded mr-2"></div>
                        Tema Claro
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyCheckoutLink(product.id, "black")}>
                        <div className="w-4 h-4 bg-black rounded mr-2"></div>
                        Tema Escuro
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CreateProductModal open={showCreateModal} onOpenChange={setShowCreateModal} />
      <EditProductModal 
        open={showEditModal} 
        onOpenChange={setShowEditModal} 
        product={selectedProduct}
      />
      <DeleteProductModal 
        open={showDeleteModal} 
        onOpenChange={setShowDeleteModal} 
        product={selectedProduct}
      />
    </div>
  );
};

export default Products;
