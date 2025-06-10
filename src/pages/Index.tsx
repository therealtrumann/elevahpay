
import { useState, useEffect } from "react";
import { DollarSign, Package, ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [filterDays, setFilterDays] = useState(7);
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalTransactions: 0,
    totalProducts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const filterOptions = [
    { label: "7 dias", value: 7 },
    { label: "14 dias", value: 14 },
    { label: "21 dias", value: 21 },
    { label: "30 dias", value: 30 },
  ];

  const fetchDashboardData = async (days: number) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate date filter
      const dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - days);
      const filterDate = dateFilter.toISOString();

      // Fetch transactions for the selected period
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          products:product_id (
            name,
            price_cents
          )
        `)
        .eq('user_id', user.id)
        .gte('created_at', filterDate)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Calculate total sales (sum of net_cents)
      const totalSales = transactions?.reduce((sum, transaction) => sum + transaction.net_cents, 0) || 0;

      // Fetch total products count (all time)
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (productsError) throw productsError;

      setSalesData({
        totalSales,
        totalTransactions: transactions?.length || 0,
        totalProducts: productsCount || 0
      });

      // Set recent activity (last 5 transactions)
      setRecentActivity(transactions?.slice(0, 5) || []);

    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(filterDays);
  }, [filterDays]);

  const formatCurrency = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffDays === 0) {
      if (diffHours === 0) {
        return "agora mesmo";
      }
      return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    }
    return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  };

  const metrics = [
    {
      title: "Vendas",
      value: formatCurrency(salesData.totalSales),
      description: `Últimos ${filterDays} dias`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total de Vendas",
      value: salesData.totalTransactions.toString(),
      description: `Últimos ${filterDays} dias`,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Produtos Criados",
      value: salesData.totalProducts.toString(),
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>{filterDays} dias</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border border-border">
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setFilterDays(option.value)}
                  className="cursor-pointer hover:bg-accent"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
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
                  {recentActivity.length > 0 ? (
                    recentActivity.map((transaction: any) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">
                            {transaction.status === 'completed' ? 'Nova venda realizada' : 'Venda pendente'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Produto: {transaction.products?.name || 'Produto não encontrado'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {transaction.status === 'completed' ? '+ ' : ''}
                            {formatCurrency(transaction.net_cents)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhuma transação encontrada nos últimos {filterDays} dias.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
