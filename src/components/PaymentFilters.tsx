
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PaymentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterYear: number | undefined;
  onYearChange: (value: number | undefined) => void;
}

export const PaymentFilters = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterYear,
  onYearChange
}: PaymentFiltersProps) => {
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="flex items-center space-x-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por socio, DNI, parcela o concepto..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={filterStatus} onValueChange={onStatusChange}>
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
      <Select 
        value={filterYear?.toString() || "todos"} 
        onValueChange={(value) => onYearChange(value === "todos" ? undefined : parseInt(value))}
      >
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
  );
};
