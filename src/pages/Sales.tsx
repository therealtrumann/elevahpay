
import { useState } from "react";
import { Settings, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SaleDetailsModal } from "@/components/SaleDetailsModal";
import { AuthModal } from "@/components/AuthModal";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [filters, setFilters] = useState({
    approved: false,
    pending: false,
    cancelled: false
  });
  
  const { user } = useAuth();
  const { data: transactions = [], isLoading } = useTransactions();

  if (!user) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
                <p className="text-muted-foreground">Faça login para ver suas vendas</p>
              </div>
            </div>
            <Button onClick={() => setShowAuthModal(true)}>
              Fazer Login
            </Button>
          </div>
        </div>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aprovado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredSales = transactions.filter(sale => {
    if (!filters.approved && !filters.pending && !filters.cancelled) {
      return true;
    }
    
    return (
      (filters.approved && sale.status === "approved") ||
      (filters.pending && sale.status === "pending") ||
      (filters.cancelled && sale.status === "cancelled")
    );
  });

  const handleFilterChange = (filterKey: keyof typeof filters, checked: boolean) => {
    setFilters(prev => ({ ...prev, [filterKey]: checked }));
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
                <p className="text-muted-foreground">Carregando vendas...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center justify-between">
              <CardTitle>Últimas Vendas</CardTitle>
              <div className="flex items-center space-x-4">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="approved"
                      checked={filters.approved}
                      onCheckedChange={(checked) => handleFilterChange('approved', checked as boolean)}
                    />
                    <label htmlFor="approved" className="text-sm text-green-700 cursor-pointer">
                      Aprovadas
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pending"
                      checked={filters.pending}
                      onCheckedChange={(checked) => handleFilterChange('pending', checked as boolean)}
                    />
                    <label htmlFor="pending" className="text-sm text-yellow-700 cursor-pointer">
                      Pendentes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cancelled"
                      checked={filters.cancelled}
                      onCheckedChange={(checked) => handleFilterChange('cancelled', checked as boolean)}
                    />
                    <label htmlFor="cancelled" className="text-sm text-red-700 cursor-pointer">
                      Canceladas
                    </label>
                  </div>
                </div>
              </div>
            </div>
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
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {new Date(sale.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{sale.products?.name || 'Produto'}</TableCell>
                    <TableCell className="font-medium">
                      R$ {(sale.net_cents / 100).toFixed(2).replace('.', ',')}
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
