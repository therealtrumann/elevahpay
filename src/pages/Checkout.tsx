
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CreditCard, Smartphone, CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import QRCode from 'qrcode';

const Checkout = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const theme = searchParams.get('theme') || 'white';
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<string[]>([]);
  const [customerData, setCustomerData] = useState({
    nome: "",
    email: "",
    cpf: "",
    valor: ""
  });
  const [cobResp, setCobResp] = useState<any>(null);
  const [locResp, setLocResp] = useState<any>(null);
  const [recResp, setRecResp] = useState<any>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const { toast } = useToast();

  const isDarkTheme = theme === 'black';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        console.log('Fetching product with ID:', productId);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;
        
        console.log('Product data fetched:', data);
        setProduct(data);

        // Set the product price as default value (read-only)
        setCustomerData(prev => ({
          ...prev,
          valor: (data.price_cents / 100).toFixed(2)
        }));

        // Determine available payment methods based on product settings
        const methods: string[] = [];
        if (data.pix_automatic) methods.push('pix');
        if (data.recurring_card) methods.push('card');
        
        console.log('Available payment methods:', methods);
        setAvailablePaymentMethods(methods);
        
        // Auto-select the first available method
        if (methods.length > 0) {
          setPaymentMethod(methods[0]);
        }
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast({
          title: "Erro",
          description: "Produto não encontrado.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const generateRandomString = (length: number = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const generateQRCode = async (text: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(text);
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const saveToDatabase = async (txid: string, locId: number, idRec: string) => {
    try {
      const { error } = await supabase
        .from('pix_transactions')
        .insert([{
          product_id: productId,
          txid: txid,
          loc_id: locId,
          id_rec: idRec,
          valor: parseFloat(customerData.valor),
          cpf: customerData.cpf,
          nome: customerData.nome,
          email: customerData.email,
          qr_code: cobResp?.data?.loc?.qrcode || "",
          status: 'pending'
        }]);

      if (error) throw error;
      console.log('Transaction saved to database');
    } catch (error: any) {
      console.error('Error saving to database:', error);
    }
  };

  const handleGeneratePix = async () => {
    if (!customerData.nome || !customerData.email || !customerData.cpf || !customerData.valor) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Action 1: Create PIX charge
      console.log('Starting Action 1: Create PIX charge');
      const cobResponse = await fetch('http://localhost:8000/php/create-cob.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calendario: {
            expiracao: 3600
          },
          devedor: {
            cpf: customerData.cpf,
            nome: customerData.nome
          },
          valor: {
            original: customerData.valor
          },
          chave: "978ba0a4-6fac-42f7-8b3d-4cf7a5850f47",
          solicitacaoPagador: "Cobrança dos serviços contratados."
        }),
      });

      if (!cobResponse.ok) {
        throw new Error('Erro ao gerar cobrança PIX');
      }

      const cobData = await cobResponse.json();
      console.log('Action 1 completed:', cobData);
      setCobResp(cobData);

      // Action 2: Create recurring location
      console.log('Starting Action 2: Create recurring location');
      const locResponse = await fetch('http://localhost:8000/php/create-locrec.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!locResponse.ok) {
        throw new Error('Erro ao criar localização recorrente');
      }

      const locData = await locResponse.json();
      console.log('Action 2 completed:', locData);
      setLocResp(locData);

      // Action 3: Create recurrence
      console.log('Starting Action 3: Create recurrence');
      const recResponse = await fetch('http://localhost:8000/php/create-rec.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vinculo: {
            contrato: generateRandomString(),
            devedor: {
              cpf: customerData.cpf,
              nome: customerData.nome
            },
            objeto: "Assinatura recorrente de serviços."
          },
          calendario: {
            dataInicial: getTodayDate(),
            periodicidade: "MENSAL"
          },
          valor: {
            valorRec: customerData.valor
          },
          politicaRetentativa: "NAO_PERMITE",
          loc: locData.data.id,
          ativacao: {
            dadosJornada: {
              txid: cobData.data.txid
            }
          }
        }),
      });

      if (!recResponse.ok) {
        throw new Error('Erro ao criar recorrência');
      }

      const recData = await recResponse.json();
      console.log('Action 3 completed:', recData);
      setRecResp(recData);

      // Action 4: Generate and display QR Code
      if (cobData.data?.loc?.qrcode) {
        console.log('Action 4: Generating QR Code');
        await generateQRCode(cobData.data.loc.qrcode);
      }

      // Save to database
      await saveToDatabase(
        cobData.data.txid,
        locData.data.id,
        recData.data.idRec
      );

      toast({
        title: "PIX gerado com sucesso!",
        description: "Sua cobrança PIX recorrente foi criada.",
      });
    } catch (error: any) {
      console.error('Erro no processo PIX:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível gerar a cobrança PIX.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchase = () => {
    if (!paymentMethod) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um método de pagamento.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing for card
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Compra realizada!",
        description: "Sua compra foi processada com sucesso.",
      });
    }, 3000);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Produto não encontrado</h1>
          <p className="text-muted-foreground">O produto solicitado não existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  const containerClass = isDarkTheme 
    ? "min-h-screen bg-gray-900 text-white" 
    : "min-h-screen bg-gray-50 text-gray-900";

  const cardClass = isDarkTheme 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-200";

  const textClass = isDarkTheme ? "text-white" : "text-gray-900";
  const mutedTextClass = isDarkTheme ? "text-gray-300" : "text-gray-600";
  const borderClass = isDarkTheme ? "border-gray-700" : "border-gray-200";
  const hoverClass = isDarkTheme ? "hover:bg-gray-700" : "hover:bg-gray-50";

  return (
    <div className={containerClass}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Product Section */}
        <Card className={`mb-6 ${cardClass}`}>
          <CardContent className="p-6">
            <div className="text-center mb-4">
              {product?.image_url ? (
                <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, show fallback
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div 
                    className={`w-full h-full ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'} rounded-full items-center justify-center`}
                    style={{ display: 'none' }}
                  >
                    <Package className={`h-12 w-12 ${isDarkTheme ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                </div>
              ) : (
                <div className={`w-24 h-24 mx-auto ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mb-4 flex items-center justify-center`}>
                  <Package className={`h-12 w-12 ${isDarkTheme ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
              )}
              
              <h1 className={`text-xl font-bold mb-2 ${textClass}`}>{product?.name}</h1>
              {product?.description && (
                <p className={`text-sm ${mutedTextClass} mb-4`}>
                  {product.description}
                </p>
              )}
              <div className="text-3xl font-bold text-green-500">
                R$ {product ? (product.price_cents / 100).toFixed(2).replace('.', ',') : '0,00'}
              </div>
              {product?.installments > 1 && (
                <p className={`text-sm ${mutedTextClass} mt-2`}>
                  Pagamento mensal
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Data Section */}
        <Card className={`mb-6 ${cardClass}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${textClass}`}>Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome" className={textClass}>Nome Completo *</Label>
              <Input
                id="nome"
                value={customerData.nome}
                onChange={(e) => setCustomerData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Digite seu nome completo"
                className={`${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
              />
            </div>
            <div>
              <Label htmlFor="email" className={textClass}>E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Digite seu e-mail"
                className={`${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
              />
            </div>
            <div>
              <Label htmlFor="cpf" className={textClass}>CPF *</Label>
              <Input
                id="cpf"
                value={customerData.cpf}
                onChange={(e) => setCustomerData(prev => ({ ...prev, cpf: e.target.value }))}
                placeholder="000.000.000-00"
                className={`${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
              />
            </div>
            <div>
              <Label htmlFor="valor" className={textClass}>Valor da Cobrança (R$) *</Label>
              <Input
                id="valor"
                type="number"
                value={customerData.valor}
                readOnly
                className={`${isDarkTheme ? 'bg-gray-600 border-gray-600 text-gray-300 cursor-not-allowed' : 'bg-gray-100 text-gray-600 cursor-not-allowed'}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Section - Only show if there are available methods */}
        {availablePaymentMethods.length > 0 && (
          <Card className={`mb-6 ${cardClass}`}>
            <CardHeader>
              <CardTitle className={`text-lg ${textClass}`}>Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                {availablePaymentMethods.includes('pix') && (
                  <div className={`flex items-center space-x-3 p-4 border ${borderClass} rounded-lg ${hoverClass}`}>
                    <RadioGroupItem value="pix" id="pix" />
                    <Smartphone className="h-5 w-5 text-green-500" />
                    <Label htmlFor="pix" className={`flex-1 cursor-pointer ${textClass}`}>
                      <div>
                        <p className="font-medium">Pix Automático</p>
                        <p className={`text-sm ${mutedTextClass}`}>
                          Aprovação instantânea
                        </p>
                      </div>
                    </Label>
                  </div>
                )}

                {availablePaymentMethods.includes('card') && (
                  <div className={`flex items-center space-x-3 p-4 border ${borderClass} rounded-lg ${hoverClass}`}>
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <Label htmlFor="card" className={`flex-1 cursor-pointer ${textClass}`}>
                      <div>
                        <p className="font-medium">Cartão de Crédito</p>
                      </div>
                    </Label>
                  </div>
                )}
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-4 space-y-3">
                  <Input 
                    placeholder="Número do cartão" 
                    className={`${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      placeholder="MM/AA" 
                      className={`${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                    />
                    <Input 
                      placeholder="CVV" 
                      className={`${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                    />
                  </div>
                  <Input 
                    placeholder="Nome no cartão" 
                    className={`${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                  />
                </div>
              )}

              {paymentMethod === "pix" && (
                <div className="mt-4">
                  <Button 
                    id="botao_pix"
                    onClick={handleGeneratePix}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processando PIX...
                      </div>
                    ) : (
                      "Gerar Pix"
                    )}
                  </Button>
                  
                  {/* Display PIX response and QR Code if available */}
                  {cobResp && (
                    <div className={`mt-4 p-4 border ${borderClass} rounded-lg ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm font-medium ${textClass} mb-2`}>PIX gerado com sucesso!</p>
                      <p className={`text-xs ${mutedTextClass} mb-3`}>ID da transação: {cobResp.data?.txid || 'N/A'}</p>
                      
                      {/* QR Code Display */}
                      {qrCodeDataUrl && (
                        <div className="text-center">
                          <p className={`text-sm font-medium ${textClass} mb-2`}>Escaneie o QR Code para pagar:</p>
                          <img 
                            src={qrCodeDataUrl} 
                            alt="QR Code PIX" 
                            className="mx-auto max-w-48 h-auto"
                          />
                        </div>
                      )}
                      
                      {/* Additional transaction info */}
                      {locResp && (
                        <p className={`text-xs ${mutedTextClass} mt-2`}>Localização: {locResp.data?.id || 'N/A'}</p>
                      )}
                      {recResp && (
                        <p className={`text-xs ${mutedTextClass}`}>Recorrência: {recResp.data?.idRec || 'N/A'}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary Section */}
        <Card className={`mb-6 ${cardClass}`}>
          <CardContent className="p-6">
            <div className={`flex justify-between items-center mb-4 ${textClass}`}>
              <span>Subtotal:</span>
              <span>R$ {product ? (product.price_cents / 100).toFixed(2).replace('.', ',') : '0,00'}</span>
            </div>
            <div className={`flex justify-between items-center mb-4 pb-4 border-b ${borderClass} ${textClass}`}>
              <span>Taxas:</span>
              <span>R$ 0,00</span>
            </div>
            <div className={`flex justify-between items-center text-lg font-bold ${textClass}`}>
              <span>Total:</span>
              <span className="text-green-500">R$ {product ? (product.price_cents / 100).toFixed(2).replace('.', ',') : '0,00'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Button - Only show for card payment */}
        {availablePaymentMethods.length > 0 && paymentMethod === "card" && (
          <Button 
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processando...
              </div>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Finalizar Compra
              </>
            )}
          </Button>
        )}

        {availablePaymentMethods.length === 0 && (
          <div className={`text-center p-4 ${textClass}`}>
            <p>Nenhum método de pagamento disponível para este produto.</p>
          </div>
        )}

        {/* Security Notice */}
        <div className={`text-center mt-6 text-sm ${mutedTextClass}`}>
          <p>🔒 Pagamento seguro e protegido</p>
          <p>Processado pela ElevahPay</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
