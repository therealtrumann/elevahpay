
import { useState } from "react";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { WithdrawModal } from "@/components/WithdrawModal";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { useWithdrawals } from "@/hooks/useWithdrawals";

const Finance = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user } = useAuth();
  const { data: transactions = [], isLoading: loadingTransactions } = useTransactions();
  const { data: withdrawals = [], isLoading: loadingWithdrawals } = useWithdrawals();

  if (!user) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
                <p className="text-muted-foreground">Faça login para ver seu saldo</p>
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

  // Calculate financial data
  const totalBalance = transactions.reduce((sum, t) => sum + t.net_cents, 0);
  
  // Available balance: transactions older than 15 days
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
  
  const availableBalance = transactions
    .filter(t => new Date(t.created_at) <= fifteenDaysAgo)
    .reduce((sum, t) => sum + t.net_cents, 0);
  
  const pendingBalance = totalBalance - availableBalance;

  if (loadingTransactions || loadingWithdrawals) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
                <p className="text-muted-foreground">Carregando dados financeiros...</p>
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
              <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
              <p className="text-muted-foreground">Gerencie seus saldos e solicite saques</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowWithdrawModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="lg"
            disabled={availableBalance < 5000} // R$ 50.00 minimum
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Solicitar Saque
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Saldo Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                R$ {(totalBalance / 100).toFixed(2).replace('.', ',')}
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Faturamento - Taxa da plataforma
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Disponível para Saque
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                R$ {(availableBalance / 100).toFixed(2).replace('.', ',')}
              </div>
              <p className="text-xs text-green-700 mt-1">
                Liberado (D+15)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">
                Saldo Pendente
              </CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">
                R$ {(pendingBalance / 100).toFixed(2).replace('.', ',')}
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Aguardando liberação
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Últimos Saques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {withdrawals.slice(0, 5).map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Saque solicitado</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(withdrawal.requested_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ {(withdrawal.amount_cents / 100).toFixed(2).replace('.', ',')}</p>
                      <p className={`text-xs ${
                        withdrawal.status === 'processed' ? 'text-green-600' : 
                        withdrawal.status === 'requested' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {withdrawal.status === 'processed' ? 'Processado' :
                         withdrawal.status === 'requested' ? 'Pendente' : 'Cancelado'}
                      </p>
                    </div>
                  </div>
                ))}
                {withdrawals.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum saque realizado ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Saque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Regras de Saque</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Os valores ficam disponíveis após D+15</li>
                    <li>• Saques processados em até 2 dias úteis</li>
                    <li>• Valor mínimo de R$ 50,00</li>
                    <li>• Sem taxa para saques</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Próxima Liberação</h4>
                  <p className="text-sm text-green-800">
                    R$ {(pendingBalance / 100).toFixed(2).replace('.', ',')} em breve
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <WithdrawModal 
        open={showWithdrawModal} 
        onOpenChange={setShowWithdrawModal}
        availableBalance={availableBalance}
      />
    </div>
  );
};

export default Finance;
