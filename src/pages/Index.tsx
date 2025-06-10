
import { useState } from "react";
import { Plus, DollarSign, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CreateProductModal } from "@/components/CreateProductModal";

const Index = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const metrics = [
    {
      title: "Saldo Total",
      value: "R$ 12.450,00",
      description: "Faturamento - Taxas",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total de Vendas",
      value: "156",
      description: "Este mês",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Produtos Criados",
      value: "24",
      description: "Ativos",
      icon: Package,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Bem-vindo de volta! Aqui está o resumo da sua conta.</p>
            </div>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Criar Produto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric) => (
            <Card key={metric.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Nova venda realizada</p>
                  <p className="text-sm text-muted-foreground">Produto: Curso de Marketing Digital</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+ R$ 297,00</p>
                  <p className="text-xs text-muted-foreground">há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Produto criado</p>
                  <p className="text-sm text-muted-foreground">E-book de Vendas</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">há 1 dia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateProductModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  );
};

export default Index;
