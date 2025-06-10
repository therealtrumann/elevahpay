
import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SaleDetailsModal } from "@/components/SaleDetailsModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Sales = () => {
  const [selectedSale, setSelectedSale] = useState<any>(null);

  const sales = [
    {
      id: 1,
      date: "2024-01-15",
      product: "Curso de Marketing Digital",
      netValue: 285.18,
      status: "approved",
      buyer: {
        name: "João Silva",
        email: "joao@email.com",
        phone: "(11) 99999-9999",
        paidValue: 297.00,
        fee: 11.82,
      }
    },
    {
      id: 2,
      date: "2024-01-14",
      product: "E-book de Vendas",
      netValue: 43.17,
      status: "approved",
      buyer: {
        name: "Maria Santos",
        email: "maria@email.com",
        phone: "(11) 88888-8888",
        paidValue: 47.00,
        fee: 3.83,
      }
    },
    {
      id: 3,
      date: "2024-01-14",
      product: "Mentoria Mensal",
      netValue: 477.19,
      status: "pending",
      buyer: {
        name: "Pedro Costa",
        email: "pedro@email.com",
        phone: "(11) 77777-7777",
        paidValue: 497.00,
        fee: 19.81,
      }
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aprovado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
              <p className="text-muted-foreground">Acompanhe suas vendas e transações</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data da Venda</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Valor Líquido</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {new Date(sale.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{sale.product}</TableCell>
                    <TableCell className="font-medium">
                      R$ {sale.netValue.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(sale.status)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSale(sale)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedSale && (
          <SaleDetailsModal
            sale={selectedSale}
            open={!!selectedSale}
            onOpenChange={() => setSelectedSale(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Sales;
