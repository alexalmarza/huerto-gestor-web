
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
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
import { Plus, Search, Euro, Calendar, User, FileText, Download, Trash2 } from "lucide-react";
import { usePayments } from "@/hooks/usePayments";
import { PaymentRegistrationDialog } from "@/components/PaymentRegistrationDialog";

export const PaymentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterYear, setFilterYear] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const pageSize = 10;
  const { payments, loading, totalCount, deletePayment, generateReceiptPDF, fetchPayments } = usePayments();

  // Calculate available years from current year and past years
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Fetch payments when filters or page change
  useEffect(() => {
    fetchPayments(currentPage, pageSize, filterYear);
  }, [currentPage, filterYear, fetchPayments]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filterYear, filterStatus]);

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

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.member?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.member?.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.plot?.number.includes(searchTerm) ||
      payment.concept?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "todos" || payment.payment_type === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleDeletePayment = async (paymentId: string) => {
    const result = await deletePayment(paymentId);
    if (result.error === null) {
      // Refresh the current page
      fetchPayments(currentPage, pageSize, filterYear);
    }
  };

  const handleGenerateReceipt = async (payment: any) => {
    await generateReceiptPDF(payment);
  };

  const handlePaymentRegistered = () => {
    // Refresh payments after a new payment is registered
    fetchPayments(currentPage, pageSize, filterYear);
    setIsAddDialogOpen(false);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
          className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    );

    // Page numbers
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    if (startPage > 0) {
      items.push(
        <PaginationItem key={0}>
          <PaginationLink onClick={() => setCurrentPage(0)} className="cursor-pointer">
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 1) {
        items.push(<PaginationEllipsis key="ellipsis1" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis2" />);
      }
      items.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink onClick={() => setCurrentPage(totalPages - 1)} className="cursor-pointer">
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}
          className={currentPage >= totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    );

    return items;
  };

  if (loading) {
    return <div className="text-center py-8">Cargando pagos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h2>
          <p className="text-gray-600">Administra los pagos de los socios</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Registrar Pago
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por socio, DNI, parcela o concepto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="parcela">Parcela</SelectItem>
            <SelectItem value="material">Material</SelectItem>
            <SelectItem value="alquiler">Alquiler</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterYear?.toString() || "todos"} onValueChange={(value) => setFilterYear(value === "todos" ? undefined : parseInt(value))}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {availableYears.map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron pagos
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <Card key={payment.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
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
                      onClick={() => handleGenerateReceipt(payment)}
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
                            onClick={() => handleDeletePayment(payment.id)}
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
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Mostrando {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalCount)} de {totalCount} pagos
          </p>
          <Pagination>
            <PaginationContent>
              {renderPaginationItems()}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <PaymentRegistrationDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onPaymentRegistered={handlePaymentRegistered}
      />
    </div>
  );
};
