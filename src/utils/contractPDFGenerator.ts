
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { Plot } from '@/hooks/usePlots';

export const generateRentalContractPDF = async (plot: Plot) => {
  try {
    if (!plot.member?.first_name || !plot.assigned_date) {
      toast.error('No es pot generar el contracte: manca informació');
      return { data: null, error: 'Falta informació d\'assignació' };
    }

    const doc = new jsPDF();
    const today = new Date();
    const year = today.getFullYear();
    const dateText = `Girona, ${today.getDate()} / ${today.toLocaleString('ca-ES', { month: 'long' })} / ${year}`;

    // Use the plot price from database, fallback to 120 if null
    const annualFee = plot.price || 120;
    const total = annualFee;

    // Encabezado
    doc.setFontSize(11);
    doc.text('ASSOCIACIÓ D\'USUARIS DE LES HORTES DE SANTA EUGÈNIA', 105, 15, { align: 'center' });
    doc.text('e-mail ........ masmarria2009@gmail.com', 105, 22, { align: 'center' });
    doc.text('Can Po Vell telèfon. 679750654 (tardes)', 105, 28, { align: 'center' });
    doc.text('NIF G55066021', 105, 34, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Ref. ${plot.location} - ${plot.number}`, 14, 45);

    // Datos del usuario
    doc.text(`${plot.member.first_name} ${plot.member.last_name || ''}`, 140, 45);
    if (plot.member.address) {
      doc.text(`${plot.member.address}`, 140, 50);
    }

    // Cuerpo
    doc.setFontSize(11);
    const body = [
      `L'Associació d'Usuaris de les Hortes de Sta. Eugènia rep de part del/la titular`,
      `${plot.member.first_name} ${plot.member.last_name || ''}, amb NIF/NIE ${plot.member.dni || 'N/A'}, la quantitat de ${total}€`,
      `en concepte de lloguer per a l'any ${year} de la parcel·la núm. ${plot.number} de la`,
      `matriu ${plot.location} de ${plot.size} m².`,
      ``,
      `La concessió es renovarà anualment. Prorrogable sempre que es compleixi la`,
      `normativa i els estatuts de l'Associació. En cas d'incompliment l'adjudicatari/a`,
      `perdrà els drets d'ús de la parcel·la i la seva condició de soci/a.`,
      ``,
      `Al cessar com a soci/a, per renúncia o pèrdua dels drets, s'abonarà la fiança amb el`,
      `retorn de la clau.`,
    ];

    let y = 70;
    body.forEach(line => {
      doc.text(line, 14, y);
      y += 7;
    });

    // Firma
    doc.text('El President', 14, y + 15);
    doc.text(dateText, 14, y + 35);

    doc.save(`contracte-hort-${plot.member.first_name}-${plot.member.last_name || ''}-${year}.pdf`);
    
    toast.success('Contracte PDF generat i descarregat exitosament');
    return { data: { fileName: `contracte-hort-${plot.member.first_name}-${plot.member.last_name || ''}-${year}.pdf` }, error: null };
  } catch (error) {
    console.error('Error generating rental contract:', error);
    toast.error('Error al generar el contracte PDF');
    return { data: null, error };
  }
};
