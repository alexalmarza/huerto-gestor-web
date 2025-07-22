import * as XLSX from 'xlsx';

export const generateMembersTemplate = () => {
  const template = [
    {
      'first_name': 'Joan',
      'last_name': 'Garcia',
      'dni': '12345678A',
      'email': 'joan.garcia@exemple.com',
      'phone': '600123456',
      'landline_phone': '971123456',
      'address': 'Carrer Major, 123',
      'postal_code': '07142',
      'city': 'Santa Eugènia',
      'join_date': '2024-01-15',
      'payment_status': 'al día'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Socios');
  
  XLSX.writeFile(workbook, 'plantilla-socios.xlsx');
};

export const generatePlotsTemplate = () => {
  const template = [
    {
      'number': 'A001',
      'size': '25 m²',
      'location': 'Sector A',
      'status': 'disponible',
      'price': '120'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Parcelas');
  
  XLSX.writeFile(workbook, 'plantilla-parcelas.xlsx');
};

export const MEMBERS_EXPECTED_COLUMNS = [
  'first_name', 'last_name', 'dni', 'email', 'phone', 
  'landline_phone', 'address', 'postal_code', 'city', 
  'join_date', 'payment_status'
];

export const PLOTS_EXPECTED_COLUMNS = [
  'number', 'size', 'location', 'status', 'price'
];