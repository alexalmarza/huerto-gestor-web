
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertTriangle, CheckCircle, Trash2, Calendar } from "lucide-react";
import { useRedFlags, RedFlag } from "@/hooks/useRedFlags";

interface RedFlagsListProps {
  entityType: 'member' | 'plot';
  entityId: string;
  onRedFlagChange?: () => void;
}

export const RedFlagsList = ({ entityType, entityId, onRedFlagChange }: RedFlagsListProps) => {
  const [entityRedFlags, setEntityRedFlags] = useState<RedFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const { getEntityRedFlags, resolveRedFlag, deleteRedFlag } = useRedFlags();

  const loadEntityRedFlags = async () => {
    setLoading(true);
    const { data } = await getEntityRedFlags(entityType, entityId);
    setEntityRedFlags(data);
    setLoading(false);
  };

  const handleResolve = async (redFlagId: string) => {
    const result = await resolveRedFlag(redFlagId);
    if (result.error === null) {
      loadEntityRedFlags();
      onRedFlagChange?.();
    }
  };

  const handleDelete = async (redFlagId: string) => {
    const result = await deleteRedFlag(redFlagId);
    if (result.error === null) {
      loadEntityRedFlags();
      onRedFlagChange?.();
    }
  };

  const getReasonLabel = (reason: string) => {
    const reasonLabels: { [key: string]: string } = {
      'impago': 'Impago de cuotas',
      'incumplimiento': 'Incumplimiento de normas',
      'mantenimiento': 'Problemas de mantenimiento',
      'conflicto': 'Conflicto con otros socios',
      'daño_propiedad': 'Daño a la propiedad',
      'otro': 'Otro motivo'
    };
    return reasonLabels[reason] || reason;
  };

  useEffect(() => {
    loadEntityRedFlags();
  }, [entityType, entityId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (entityRedFlags.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay red flags registradas
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entityRedFlags.map((flag) => (
        <Card key={flag.id} className={`border-l-4 ${flag.resolved ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                {flag.resolved ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <CardTitle className="text-base">{getReasonLabel(flag.reason)}</CardTitle>
                  <CardDescription className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(flag.flagged_at).toLocaleDateString()}</span>
                    {flag.flagged_by && <span>• Por: {flag.flagged_by}</span>}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={flag.resolved ? "secondary" : "destructive"}>
                  {flag.resolved ? 'Resuelta' : 'Activa'}
                </Badge>
                <div className="flex space-x-1">
                  {!flag.resolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(flag.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar red flag?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. La red flag será eliminada permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(flag.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardHeader>
          {flag.description && (
            <CardContent>
              <p className="text-sm text-gray-600">{flag.description}</p>
            </CardContent>
          )}
          {flag.resolved && flag.resolved_at && (
            <CardContent className="pt-0">
              <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
                Resuelta el {new Date(flag.resolved_at).toLocaleDateString()}
                {flag.resolved_by && ` por ${flag.resolved_by}`}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};
