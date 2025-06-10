
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const Confirmado = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Elevah Pay</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <p className="text-lg">E-mail confirmado com sucesso. Você já pode fazer login.</p>
          <Link to="/login">
            <Button className="w-full">
              Fazer Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Confirmado;
