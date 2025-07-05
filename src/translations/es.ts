
export const translations = {
  // Header
  appTitle: "Huerto Gestor",
  appSubtitle: "Sistema de Gestión de Huertos Comunitarios",
  welcome: "Bienvenido",
  signOut: "Cerrar Sesión",

  // Navigation
  overview: "Resumen",
  plots: "Parcelas",
  members: "Socios",
  inactiveMembers: "Inactivos",
  payments: "Pagos",
  reports: "Reportes",

  // Overview Stats
  totalPlots: "Total Parcelas",
  activeMembers: "Socios Activos",
  pendingPayments: "Pagos Pendientes",
  generatedReports: "Reportes Generados",
  plotStatus: "Estado de Parcelas",
  memberStatus: "Estado de Socios",
  plotsDistribution: "Distribución actual de las {total} parcelas",
  membersDistribution: "Distribución de socios activos e inactivos",
  occupied: "Ocupadas",
  available: "Disponibles",
  active: "Activos",
  inactive: "Inactivos",
  pending: "Pendientes",

  // Plot Management
  createPlot: "Nueva Parcela",
  plotNumber: "Parcela #",
  size: "Tamaño",
  location: "Matriz",
  price: "Precio",
  pricePerYear: "Precio (€/año)",
  status: "Estado",
  assignedTo: "Asignada a",
  assignedDate: "Asignada",
  plotAvailable: "Parcela disponible",
  assign: "Asignar",
  unassign: "Desasignar",
  generateContract: "Generar Contrato PDF",
  generatingContract: "Generando contrato...",
  editPlot: "Editar Parcela",
  deletePlot: "Eliminar Parcela",

  // Plot Status
  statusOccupied: "ocupada",
  statusAvailable: "disponible",
  statusMaintenance: "mantenimiento",

  // Plot Creation/Edit
  newPlot: "Nueva Parcela",
  createNewPlot: "Crear una nueva parcela en el huerto urbano",
  plotNumberLabel: "Número",
  plotNumberPlaceholder: "ej: 001",
  sizePlaceholder: "ej: 25 m²",
  locationPlaceholder: "ej: Matriz",
  pricePlaceholder: "120.00",
  allFieldsRequired: "Todos los campos son obligatorios",
  creating: "Creando...",
  createPlotBtn: "Crear Parcela",
  updating: "Actualizando...",
  updatePlotBtn: "Actualizar Parcela",
  editPlotTitle: "Editar Parcela #",
  modifyPlotData: "Modifica los datos de la parcela",

  // Plot Assignment/Unassignment
  assignPlot: "Asignar Parcela",
  selectMember: "Selecciona un socio para asignar la parcela",
  searchMembers: "Buscar socios...",
  noMembersFound: "No se encontraron socios",
  assigning: "Asignando...",
  assignPlotBtn: "Asignar Parcela",
  unassignPlot: "Desasignar Parcela #",
  confirmUnassign: "¿Estás seguro de querer desasignar esta parcela de",
  plotWillBeAvailable: "La parcela quedará disponible para asignar a otro socio.",
  unassigning: "Desasignando...",
  unassignPlotBtn: "Desasignar Parcela",

  // Member Management
  createMember: "Nuevo Socio",
  memberName: "Nombre",
  memberEmail: "Email",
  memberPhone: "Teléfono",
  memberDni: "DNI/NIE",
  memberAddress: "Dirección",
  joinDate: "Fecha de alta",
  paymentStatus: "Estado de pago",
  member: "Socio",
  activeMember: "Socio activo",
  inactiveMember: "Socio inactivo",
  deactivateMember: "Desactivar Socio",
  reactivateMember: "Reactivar Socio",
  editMember: "Editar Socio",
  viewDetails: "Ver detalles",

  // Payment Status
  paymentPaid: "pagado",
  paymentPending: "pendiente",
  paymentOverdue: "atrasado",

  // Member Deactivation
  deactivateMemberTitle: "Desactivar Socio",
  confirmDeactivation: "¿Estás seguro de querer desactivar a",
  deactivationReason: "Motivo de la baja",
  deactivationReasonPlaceholder: "Describe el motivo de la desactivación...",
  deactivating: "Desactivando...",
  deactivateMemberBtn: "Desactivar Socio",

  // Payments
  paymentType: "Tipo",
  amount: "Importe",
  concept: "Concepto",
  paymentDate: "Fecha de pago",
  receiptNumber: "Número de recibo",
  registerPayment: "Registrar Pago",

  // Payment Types
  paymentPlot: "Parcela",
  paymentMaterial: "Material",
  paymentRental: "Alquiler",

  // Payment Filters
  searchPayments: "Buscar por socio, DNI, parcela o concepto...",
  filterByType: "Filtrar por tipo",
  allTypes: "Todos los tipos",
  year: "Año",
  all: "Todos",

  // Reports
  reportsTitle: "Reportes y Exportaciones",
  reportsDescription: "Genera y descarga reportes del sistema",
  generateReport: "Generar Reporte",
  exportExcel: "Exportar a Excel",
  downloadingReport: "Descargando reporte...",

  // Report Types
  membersReport: "Reporte de Socios",
  plotsReport: "Reporte de Parcelas",
  paymentsReport: "Reporte de Pagos",
  annualReport: "Reporte Anual",
  pendingPaymentsReport: "Pagos Pendientes",

  // Auth
  accessSystem: "Acceso al Sistema",
  accessDescription: "Inicia sesión o regístrate para acceder",
  signIn: "Iniciar Sesión",
  signUp: "Registrarse",
  fullName: "Nombre Completo",
  password: "Contraseña",
  signingIn: "Iniciando sesión...",
  signingUp: "Registrando...",
  createAccount: "Crear Cuenta",
  fullNamePlaceholder: "Tu nombre completo",

  // Common
  cancel: "Cancelar",
  save: "Guardar",
  edit: "Editar",
  delete: "Eliminar",
  close: "Cerrar",
  search: "Buscar",
  filter: "Filtrar",
  export: "Exportar",
  loading: "Cargando...",
  noData: "No hay datos",
  error: "Error",
  success: "Éxito",
  confirm: "Confirmar",
  yes: "Sí",
  no: "No",

  // Error Messages
  errorCreatingPlot: "Error al crear la parcela",
  errorUpdatingPlot: "Error al actualizar la parcela",
  errorDeletingPlot: "Error al eliminar la parcela",
  errorAssigningPlot: "Error al asignar la parcela",
  errorUnassigningPlot: "Error al desasignar la parcela",
  errorCreatingMember: "Error al crear el socio",
  errorUpdatingMember: "Error al actualizar el socio",
  errorDeactivatingMember: "Error al desactivar el socio",

  // Success Messages
  plotCreated: "Parcela creada exitosamente",
  plotUpdated: "Parcela actualizada exitosamente",
  plotDeleted: "Parcela eliminada exitosamente",
  plotAssigned: "Parcela asignada exitosamente",
  plotUnassigned: "Parcela desasignada exitosamente",
  memberCreated: "Socio creado exitosamente",
  memberUpdated: "Socio actualizado exitosamente",
  memberDeactivated: "Socio desactivado exitosamente",
  contractGenerated: "Contrato PDF generado y descargado exitosamente",

  // 404 Page
  pageNotFound: "Página no encontrada",
  pageNotFoundMessage: "¡Ups! Página no encontrada",
  backToHome: "Volver al inicio",

  // Red Flags
  incident: "Incidencia",
  newIncident: "Nueva Incidencia",
  incidentTitle: "Título",
  incidentDescription: "Descripción (opcional)",
  createIncident: "Crear Incidencia",
};
