
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

const Checkout = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const theme = searchParams.get('theme') || 'white';
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<string[]>([]);
  const { toast } = useToast();

  const isDarkTheme = theme === 'black';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;
        setProduct(data);

        // Determine available payment methods based on product settings
        const methods: string[] = [];
        if (data.pix_automatic) methods.push('pix');
        if (data.recurring_card) methods.push('card');
        
        setAvailablePaymentMethods(methods);
        
        // Auto-select the first available method
        if (methods.length > 0) {
          setPaymentMethod(methods[0]);
        }
      } catch (error: any) {
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
    
    // Simulate payment processing
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
              {product.image_url ? (
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
              
              <h1 className={`text-xl font-bold mb-2 ${textClass}`}>{product.name}</h1>
              {product.description && (
                <p className={`text-sm ${mutedTextClass} mb-4`}>
                  {product.description}
                </p>
              )}
              <div className="text-3xl font-bold text-green-500">
                R$ {(product.price_cents / 100).toFixed(2).replace('.', ',')}
              </div>
              {product.installments > 1 && (
                <p className={`text-sm ${mutedTextClass} mt-2`}>
                  Em até {product.installments}x sem juros
                </p>
              )}
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
                        <p className="font-medium">PIX</p>
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
                        <p className={`text-sm ${mutedTextClass}`}>
                          Parcelamento disponível
                        </p>
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
            </CardContent>
          </Card>
        )}

        {/* Summary Section */}
        <Card className={`mb-6 ${cardClass}`}>
          <CardContent className="p-6">
            <div className={`flex justify-between items-center mb-4 ${textClass}`}>
              <span>Subtotal:</span>
              <span>R$ {(product.price_cents / 100).toFixed(2).replace('.', ',')}</span>
            </div>
            <div className={`flex justify-between items-center mb-4 pb-4 border-b ${borderClass} ${textClass}`}>
              <span>Taxas:</span>
              <span>R$ 0,00</span>
            </div>
            <div className={`flex justify-between items-center text-lg font-bold ${textClass}`}>
              <span>Total:</span>
              <span className="text-green-500">R$ {(product.price_cents / 100).toFixed(2).replace('.', ',')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Button - Only show if payment methods are available */}
        {availablePaymentMethods.length > 0 ? (
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
        ) : (
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
