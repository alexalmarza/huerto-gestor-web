
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Plus, Search, Euro, Calendar, User, FileText, Download } from "lucide-react";

export const PaymentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Mock data - en producción esto vendría de Supabase
  const payments = [
    {
      id: 1,
      memberName: "Juan Pérez González",
      memberDni: "12345678A",
      plotNumber: "001",
      year: 2024,
      amount: 120,
      dueDate: "2024-03-31",
      paidDate: "2024-03-15",
      status: "pagado",
      receiptNumber: "REC-2024-001"
    },
    {
      id: 2,
      memberName: "María García López",
      memberDni: "87654321B",
      plotNumber: "003",
      year: 2024,
      amount: 120,
      dueDate: "2024-03-31",
      paidDate: null,
      status: "pendiente",
      receiptNumber: null
    },
    {
      id: 3,
      memberName: "Carlos Rodríguez",
      memberDni: "11223344C",
      plotNumber: "015",
      year: 2024,
      amount: 120,
      dueDate: "2024-03-31",
      paidDate: null,
      status: "vencido",
      receiptNumber: null
    },
    // Más pagos...
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pagado":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "vencido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.memberDni.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.plotNumber.includes(searchTerm);
    
    const matchesStatus = filterStatus === "todos" || payment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const generateReceipt = (paymentId: number) => {
    // En producción, esto generaría un PDF real
    console.log(`Generando recibo para pago ${paymentId}`);
  };

  const generateExpulsionNotice = (paymentId: number) => {
    // En producción, esto generaría un PDF de aviso de expulsión
    console.log(`Generando aviso de expulsión para pago ${paymentId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h2>
          <p className="text-gray-600">Administra los pagos anuales de los socios</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Pago
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Pago</DialogTitle>
              <DialogDescription>
                Registra un pago realizado por un socio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="member">Socio</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar socio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Juan Pérez González - Parcela #001</SelectItem>
                    <SelectItem value="2">María García López - Parcela #003</SelectItem>
                    <SelectItem value="3">Carlos Rodríguez - Parcela #015</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Importe (€)</Label>
                  <Input id="amount" type="number" placeholder="120" />
                </div>
                <div>
                  <Label htmlFor="year">Año</Label>
                  <Input id="year" type="number" placeholder="2024" />
                </div>
              </div>
              <div>
                <Label htmlFor="paidDate">Fecha de Pago</Label>
                <Input id="paidDate" type="date" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Registrar Pago
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por socio, DNI o parcela..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="pagado">Pagado</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="vencido">Vencido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{payment.memberName}</h3>
                      <p className="text-sm text-gray-600">DNI: {payment.memberDni} • Parcela #{payment.plotNumber}</p>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-gray-400" />
                      <span><strong>Importe:</strong> {payment.amount}€</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span><strong>Año:</strong> {payment.year}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span><strong>Vencimiento:</strong> {payment.dueDate}</span>
                    </div>
                    {payment.paidDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span><strong>Pagado:</strong> {payment.paidDate}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  {payment.status === "pagado" && payment.receiptNumber && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateReceipt(payment.id)}
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Recibo</span>
                    </Button>
                  )}
                  
                  {payment.status === "vencido" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateExpulsionNotice(payment.id)}
                      className="flex items-center space-x-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Aviso</span>
                    </Button>
                  )}
                  
                  {payment.status === "pendiente" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Marcar Pagado
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
