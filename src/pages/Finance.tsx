
import { useState } from "react";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { WithdrawModal } from "@/components/WithdrawModal";

const Finance = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const financialData = {
    totalBalance: 12450.00,
    availableBalance: 8750.00,
    pendingBalance: 3700.00,
    totalWithdrawn: 25800.00,
  };

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
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Solicitar Saque
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Saldo Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                R$ {financialData.totalBalance.toFixed(2).replace('.', ',')}
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
                R$ {financialData.availableBalance.toFixed(2).replace('.', ',')}
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
                R$ {financialData.pendingBalance.toFixed(2).replace('.', ',')}
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Aguardando liberação
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">
                Total Sacado
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                R$ {financialData.totalWithdrawn.toFixed(2).replace('.', ',')}
              </div>
              <p className="text-xs text-purple-700 mt-1">
                Histórico total
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
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Saque solicitado</p>
                    <p className="text-sm text-muted-foreground">15/01/2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">R$ 2.500,00</p>
                    <p className="text-xs text-green-600">Processado</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Saque solicitado</p>
                    <p className="text-sm text-muted-foreground">08/01/2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">R$ 1.800,00</p>
                    <p className="text-xs text-green-600">Processado</p>
                  </div>
                </div>
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
                    R$ 1.250,00 em <strong>22/01/2024</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <WithdrawModal open={showWithdrawModal} onOpenChange={setShowWithdrawModal} />
    </div>
  );
};

export default Finance;
