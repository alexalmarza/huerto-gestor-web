
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlots } from "@/hooks/usePlots";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!number.trim() || !size.trim() || !location.trim()) {
      toast.error(t('allFieldsRequired'));
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
      toast.error(t('errorCreatingPlot'));
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
            <DialogTitle>{t('newPlot')}</DialogTitle>
            <DialogDescription>
              {t('createNewPlot')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                {t('plotNumberLabel')}
              </Label>
              <Input
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="col-span-3"
                placeholder={t('plotNumberPlaceholder')}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">
                {t('size')}
              </Label>
              <Input
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="col-span-3"
                placeholder={t('sizePlaceholder')}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                {t('location')}
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="col-span-3"
                placeholder={t('locationPlaceholder')}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                {t('pricePerYear')}
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="col-span-3"
                placeholder={t('pricePlaceholder')}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isCreating}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? t('creating') : t('createPlotBtn')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
