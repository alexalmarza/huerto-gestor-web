
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Euro, Calendar, FileText, Download, Trash2 } from "lucide-react";
import { Payment } from "@/hooks/usePayments";

interface PaymentCardProps {
  payment: Payment;
  onDelete: (paymentId: string) => void;
  onGenerateReceipt: (payment: Payment) => void;
}

export const PaymentCard = ({ payment, onDelete, onGenerateReceipt }: PaymentCardProps) => {
  const getStatusColor = (paymentType: string) => {
    switch (paymentType) {
      case "parcela":
        return "bg-green-100 text-green-800";
      case "material":
        return "bg-blue-100 text-blue-800";
      case "alquiler":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentTypeLabel = (paymentType: string) => {
    switch (paymentType) {
      case "parcela":
        return "Parcela";
      case "material":
        return "Material";
      case "alquiler":
        return "Alquiler";
      default:
        return paymentType;
    }
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{payment.member?.name}</h3>
                <p className="text-sm text-gray-600">
                  DNI: {payment.member?.dni}
                  {payment.plot?.number && ` • Parcela #${payment.plot.number}`}
                </p>
              </div>
              <Badge className={getStatusColor(payment.payment_type)}>
                {getPaymentTypeLabel(payment.payment_type)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Euro className="h-4 w-4 text-gray-400" />
                <span><strong>Importe:</strong> {payment.amount}€</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span><strong>Año:</strong> {payment.payment_year}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span><strong>Fecha:</strong> {new Date(payment.payment_date).toLocaleDateString()}</span>
              </div>
              {payment.receipt_number && (
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span><strong>Recibo:</strong> {payment.receipt_number}</span>
                </div>
              )}
            </div>

            {payment.concept && (
              <div className="text-sm">
                <strong>Concepto:</strong> {payment.concept}
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerateReceipt(payment)}
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Recibo</span>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar pago?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El pago será eliminado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(payment.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
