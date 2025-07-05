
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlots } from "@/hooks/usePlots";
import { toast } from "sonner";

interface PlotCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlotCreationDialog = ({ isOpen, onClose }: PlotCreationDialogProps) => {
  const [number, setNumber] = useState("");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("120");
  const [isCreating, setIsCreating] = useState(false);
  const { createPlot } = usePlots();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!number.trim() || !size.trim() || !location.trim()) {
      toast.error("Tots els camps són obligatoris");
      return;
    }

    setIsCreating(true);
    try {
      await createPlot({
        number: number.trim(),
        size: size.trim(),
        location: location.trim(),
        price: price ? parseFloat(price) : 120
      });
      
      // Reset form
      setNumber("");
      setSize("");
      setLocation("");
      setPrice("120");
      onClose();
    } catch (error) {
      console.error("Error creating plot:", error);
      toast.error("Error al crear la parcela");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setNumber("");
      setSize("");
      setLocation("");
      setPrice("120");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova Parcel·la</DialogTitle>
            <DialogDescription>
              Crear una nova parcel·la a l'hort urbà
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Número
              </Label>
              <Input
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="col-span-3"
                placeholder="ex: 001"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">
                Mida
              </Label>
              <Input
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="col-span-3"
                placeholder="ex: 25 m²"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Matriu
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="col-span-3"
                placeholder="ex: Matriu"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Preu (€/any)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="col-span-3"
                placeholder="120.00"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isCreating}>
              Cancel·lar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creant..." : "Crear Parcel·la"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
