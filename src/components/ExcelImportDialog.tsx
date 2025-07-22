import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertTriangle } from "lucide-react";
import * as XLSX from 'xlsx';

interface ExcelImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => Promise<void>;
  title: string;
  description: string;
  expectedColumns: string[];
}

export const ExcelImportDialog = ({ 
  isOpen, 
  onClose, 
  onImport, 
  title, 
  description, 
  expectedColumns 
}: ExcelImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      setData(jsonData);
      setShowPreview(true);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (data.length === 0) return;
    
    try {
      setIsProcessing(true);
      await onImport(data);
      handleClose();
    } catch (error) {
      console.error('Error importing data:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setData([]);
    setShowPreview(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showPreview ? (
            <>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  El fitxer Excel ha de contenir les següents columnes: {expectedColumns.join(', ')}
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="excel-file">Seleccionar fitxer Excel</Label>
                <Input
                  id="excel-file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
              </div>
            </>
          ) : (
            <>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  S'importaran {data.length} registres. Aquests es sumaran als existents.
                </AlertDescription>
              </Alert>

              <div className="max-h-40 overflow-y-auto">
                <h4 className="font-medium mb-2">Vista prèvia dels primers 5 registres:</h4>
                <div className="text-sm space-y-1">
                  {data.slice(0, 5).map((row, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded">
                      {Object.entries(row).map(([key, value]) => (
                        <span key={key} className="mr-4">
                          <strong>{key}:</strong> {String(value)}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
              Cancel·lar
            </Button>
            {showPreview && (
              <Button onClick={handleImport} disabled={isProcessing || data.length === 0}>
                <Upload className="h-4 w-4 mr-2" />
                {isProcessing ? 'Important...' : `Importar ${data.length} registres`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};