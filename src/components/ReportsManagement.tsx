
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Users, 
  MapPin, 
  Euro, 
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useReports } from "@/hooks/useReports";
import { usePlots } from "@/hooks/usePlots";
import { useMembers } from "@/hooks/useMembers";

export const ReportsManagement = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const { loading, generateMembersReport, generatePlotsReport, generatePaymentsReport, generateAnnualReport, generatePendingPaymentsReport } = useReports();
  const { plots } = usePlots();
  const { members } = useMembers();

  // Calcular estadísticas en tiempo real
  const totalPlots = plots.length;
  const availablePlots = plots.filter(plot => plot.status === 'disponible').length;
  const activeMembers = members.filter(member => member.is_active).length;
  const pendingPayments = members.filter(member => member.payment_status === 'pendiente').length;
  const newMembersThisMonth = members.filter(member => {
    const joinDate = new Date(member.join_date);
    const now = new Date();
    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
  }).length;
  const expulsionCases = members.filter(member => !member.is_active && member.deactivation_reason?.includes('expulsión')).length;

  const reportTypes = [
    {
      id: "members-list",
      title: "Listado de Socios",
      description: "Lista completa de todos los socios activos e inactivos",
      icon: Users,
      color: "text-blue-600",
      handler: generateMembersReport
    },
    {
      id: "plots-status",
      title: "Estado de Parcelas",
      description: "Reporte del estado actual de todas las parcelas",
      icon: MapPin,
      color: "text-green-600",
      handler: generatePlotsReport
    },
    {
      id: "payments-summary",
      title: "Resumen de Pagos",
      description: "Estado de pagos anuales y análisis financiero",
      icon: Euro,
      color: "text-orange-600",
      handler: () => generatePaymentsReport(parseInt(selectedYear))
    },
    {
      id: "annual-report",
      title: "Informe Anual",
      description: "Reporte completo de actividades del año",
      icon: BarChart3,
      color: "text-purple-600",
      handler: () => generateAnnualReport(parseInt(selectedYear))
    }
  ];

  const quickReports = [
    {
      title: "Pagos Pendientes",
      description: "Socios con pagos pendientes",
      count: pendingPayments,
      action: "Generar Lista",
      handler: generatePendingPaymentsReport,
      icon: AlertCircle,
      color: "text-red-600"
    },
    {
      title: "Parcelas Disponibles",
      description: "Parcelas sin asignar",
      count: availablePlots,
      action: "Ver Disponibles",
      handler: generatePlotsReport,
      icon: MapPin,
      color: "text-green-600"
    },
    {
      title: "Nuevos Socios (Mes)",
      description: "Incorporaciones del mes actual",
      count: newMembersThisMonth,
      action: "Ver Nuevos",
      handler: generateMembersReport,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Avisos de Expulsión",
      description: "Casos pendientes de expulsión",
      count: expulsionCases,
      action: "Generar Avisos",
      handler: generateMembersReport,
      icon: AlertCircle,
      color: "text-yellow-600"
    }
  ];

  const availableYears = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Reportes</h2>
        <p className="text-gray-600">Genera reportes en Excel con datos reales de la asociación</p>
      </div>

      {/* Reportes Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickReports.map((report, index) => (
          <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <report.icon className={`h-5 w-5 ${report.color}`} />
                <span>{report.title}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {report.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  {report.count}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={report.handler}
                  disabled={loading}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  {loading ? "Generando..." : report.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estadísticas Generales */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <span>Estadísticas Actuales</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activeMembers}</div>
              <div className="text-sm text-gray-600">Socios Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalPlots}</div>
              <div className="text-sm text-gray-600">Total Parcelas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{pendingPayments}</div>
              <div className="text-sm text-gray-600">Pagos Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{newMembersThisMonth}</div>
              <div className="text-sm text-gray-600">Nuevos Este Mes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generador de Reportes Principales */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <span>Generador de Reportes Excel</span>
          </CardTitle>
          <CardDescription>
            Selecciona el año para reportes financieros y anuales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="text-sm text-gray-600">
              Año seleccionado para reportes financieros: <strong>{selectedYear}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tipos de Reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report) => (
          <Card key={report.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <report.icon className={`h-8 w-8 ${report.color}`} />
                <div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {report.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={report.handler}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? "Generando Excel..." : "Generar Excel"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Información sobre los reportes */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <CheckCircle className="h-5 w-5" />
            <span>Información de los Reportes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2 text-sm">
            <li>• Todos los reportes se generan con datos reales de la base de datos</li>
            <li>• Los archivos Excel incluyen múltiples hojas con datos detallados y resúmenes</li>
            <li>• Los reportes financieros respetan el año seleccionado</li>
            <li>• Los archivos se descargan automáticamente al generarse</li>
            <li>• Cada reporte incluye la fecha de generación para trazabilidad</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
