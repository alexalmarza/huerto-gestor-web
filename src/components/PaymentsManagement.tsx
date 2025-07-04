
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePayments } from "@/hooks/usePayments";
import { PaymentRegistrationDialog } from "@/components/PaymentRegistrationDialog";
import { PaymentFilters } from "@/components/PaymentFilters";
import { PaymentCard } from "@/components/PaymentCard";
import { PaymentsPagination } from "@/components/PaymentsPagination";

export const PaymentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterYear, setFilterYear] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const pageSize = 10;
  const { payments, loading, totalCount, deletePayment, generateReceiptPDF, fetchPayments } = usePayments();

  const loadPayments = useCallback(() => {
    fetchPayments(currentPage, pageSize, filterYear);
  }, [currentPage, filterYear, fetchPayments]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filterYear, filterStatus]);

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = 
        payment.member?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.member?.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.plot?.number.includes(searchTerm) ||
        payment.concept?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "todos" || payment.payment_type === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, filterStatus]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleDeletePayment = useCallback(async (paymentId: string) => {
    const result = await deletePayment(paymentId);
    if (result.error === null) {
      loadPayments();
    }
  }, [deletePayment, loadPayments]);

  const handleGenerateReceipt = useCallback(async (payment: any) => {
    await generateReceiptPDF(payment);
  }, [generateReceiptPDF]);

  const handlePaymentRegistered = useCallback(() => {
    loadPayments();
    setIsAddDialogOpen(false);
  }, [loadPayments]);

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

      <PaymentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterYear={filterYear}
        onYearChange={setFilterYear}
      />

      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron pagos
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onDelete={handleDeletePayment}
              onGenerateReceipt={handleGenerateReceipt}
            />
          ))
        )}
      </div>

      <PaymentsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalCount={totalCount}
        pageSize={pageSize}
      />

      <PaymentRegistrationDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onPaymentRegistered={handlePaymentRegistered}
      />
    </div>
  );
};
