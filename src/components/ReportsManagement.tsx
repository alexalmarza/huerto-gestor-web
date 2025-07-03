
import { useState } from "react";
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
  TrendingUp
} from "lucide-react";

export const ReportsManagement = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");

  const reportTypes = [
    {
      id: "members-list",
      title: "Listado de Socios",
      description: "Lista completa de todos los socios activos con sus datos",
      icon: Users,
      color: "text-blue-600"
    },
    {
      id: "plots-status",
      title: "Estado de Parcelas",
      description: "Reporte del estado actual de todas las parcelas",
      icon: MapPin,
      color: "text-green-600"
    },
    {
      id: "payments-summary",
      title: "Resumen de Pagos",
      description: "Estado de pagos anuales y morosidad",
      icon: Euro,
      color: "text-orange-600"
    },
    {
      id: "annual-report",
      title: "Informe Anual",
      description: "Reporte completo de actividades del año",
      icon: BarChart3,
      color: "text-purple-600"
    },
    {
      id: "financial-report",
      title: "Informe Financiero",
      description: "Análisis financiero detallado",
      icon: PieChart,
      color: "text-red-600"
    },
    {
      id: "growth-analysis",
      title: "Análisis de Crecimiento",
      description: "Tendencias y proyecciones de crecimiento",
      icon: TrendingUp,
      color: "text-indigo-600"
    }
  ];

  const quickReports = [
    {
      title: "Pagos Pendientes",
      description: "Socios con pagos pendientes",
      count: 15,
      action: "Generar Lista"
    },
    {
      title: "Parcelas Disponibles",
      description: "Parcelas sin asignar",
      count: 15,
      action: "Ver Disponibles"
    },
    {
      title: "Nuevos Socios (Mes)",
      description: "Incorporaciones del mes actual",
      count: 8,
      action: "Ver Nuevos"
    },
    {
      title: "Avisos de Expulsión",
      description: "Casos pendientes de expulsión",
      count: 3,
      action: "Generar Avisos"
    }
  ];

  const generateReport = (reportId: string) => {
    // En producción, esto generaría el PDF correspondiente
    console.log(`Generando reporte: ${reportId} para el año ${selectedYear}`);
  };

  const generateQuickReport = (reportTitle: string) => {
    // En producción, esto generaría el reporte rápido
    console.log(`Generando reporte rápido: ${reportTitle}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Reportes</h2>
        <p className="text-gray-600">Genera reportes y análisis de la asociación</p>
      </div>

      {/* Reportes Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickReports.map((report, index) => (
          <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{report.title}</CardTitle>
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
                  onClick={() => generateQuickReport(report.title)}
                  className="text-xs"
                >
                  {report.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generador de Reportes Principales */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <span>Generador de Reportes</span>
          </CardTitle>
          <CardDescription>
            Selecciona el tipo de reporte que deseas generar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccionar tipo de reporte" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((report) => (
                  <SelectItem key={report.id} value={report.id}>
                    {report.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={() => generateReport(selectedReport)}
              disabled={!selectedReport}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Generar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tipos de Reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <Card key={report.id} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
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
                variant="outline"
                size="sm"
                onClick={() => generateReport(report.id)}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Generar Reporte
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Historial de Reportes */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span>Historial de Reportes</span>
          </CardTitle>
          <CardDescription>
            Reportes generados recientemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Listado de Socios - Marzo 2024", date: "2024-03-15", size: "2.3 MB" },
              { name: "Estado de Pagos - Febrero 2024", date: "2024-02-28", size: "1.8 MB" },
              { name: "Informe Anual 2023", date: "2024-01-15", size: "4.5 MB" },
            ].map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-600">
                      Generado el {file.date} • {file.size}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
