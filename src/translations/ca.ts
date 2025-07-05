
export const translations = {
  // Header
  appTitle: "Huerto Gestor",
  appSubtitle: "Sistema de Gestió d'Horts Comunitaris",
  welcome: "Benvingut",
  signOut: "Tancar Sessió",
  signOutPopUp: "Fins aviat!",

  // Navigation
  overview: "Resum",
  plots: "Parcel·les",
  members: "Socis",
  inactiveMembers: "Inactius",
  payments: "Pagaments",
  reports: "Informes",

  // Overview Stats
  totalPlots: "Total Parcel·les",
  activeMembers: "Socis Actius",
  pendingPayments: "Pagaments Pendents",
  generatedReports: "Informes Generats",
  plotStatus: "Estat de Parcel·les",
  memberStatus: "Estat de Socis",
  plotsDistribution: "Distribució actual de les {total} parcel·les",
  membersDistribution: "Distribució de socis actius i inactius",
  occupied: "Ocupades",
  available: "Disponibles",
  active: "Actius",
  inactive: "Inactius",
  pending: "Pendents",

  // Plot Management
  createPlot: "Nova Parcel·la",
  plotNumber: "Parcel·la #",
  size: "Mida",
  location: "Matriu",
  price: "Preu",
  pricePerYear: "Preu (€/any)",
  status: "Estat",
  assignedTo: "Assignada a",
  assignedDate: "Assignada",
  plotAvailable: "Parcel·la disponible",
  assign: "Assignar",
  unassign: "Desassignar",
  generateContract: "Generar Contracte PDF",
  generatingContract: "Generant contracte...",
  editPlot: "Editar Parcel·la",
  deletePlot: "Eliminar Parcel·la",

  // Plot Status
  statusOccupied: "ocupada",
  statusAvailable: "disponible", 
  statusMaintenance: "manteniment",

  // Plot Creation/Edit
  newPlot: "Nova Parcel·la",
  createNewPlot: "Crear una nova parcel·la a l'hort urbà",
  plotNumberLabel: "Número",
  plotNumberPlaceholder: "ex: 001",
  sizePlaceholder: "ex: 25 m²",
  locationPlaceholder: "ex: Matriu",
  pricePlaceholder: "120.00",
  allFieldsRequired: "Tots els camps són obligatoris",
  creating: "Creant...",
  createPlotBtn: "Crear Parcel·la",
  updating: "Actualitzant...",
  updatePlotBtn: "Actualitzar Parcel·la",
  editPlotTitle: "Editar Parcel·la #",
  modifyPlotData: "Modifica les dades de la parcel·la",

  // Plot Assignment/Unassignment
  assignPlot: "Assignar Parcel·la",
  selectMember: "Seleccioneu un soci per assignar la parcel·la",
  searchMembers: "Buscar socis...",
  noMembersFound: "No s'han trobat socis",
  assigning: "Assignant...",
  assignPlotBtn: "Assignar Parcel·la",
  unassignPlot: "Desassignar Parcel·la #",
  confirmUnassign: "Estàs segur de voler desassignar aquesta parcel·la de",
  plotWillBeAvailable: "La parcel·la quedarà disponible per assignar a un altre soci.",
  unassigning: "Desassignant...",
  unassignPlotBtn: "Desassignar Parcel·la",

  // Member Management
  createMember: "Nou Soci",
  memberName: "Nom",
  memberEmail: "Email",
  memberPhone: "Telèfon",
  memberDni: "DNI/NIE",
  memberAddress: "Adreça",
  joinDate: "Data d'alta",
  paymentStatus: "Estat de pagament",
  member: "Soci",
  activeMember: "Soci actiu",
  inactiveMember: "Soci inactiu",
  deactivateMember: "Desactivar Soci",
  reactivateMember: "Reactivar Soci",
  editMember: "Editar Soci",
  viewDetails: "Veure detalls",

  // Payment Status
  paymentPaid: "pagat",
  paymentPending: "pendent",
  paymentOverdue: "endarrerit",

  // Member Deactivation
  deactivateMemberTitle: "Desactivar Soci",
  confirmDeactivation: "Estàs segur de voler desactivar a",
  deactivationReason: "Motiu de la baixa",
  deactivationReasonPlaceholder: "Descriu el motiu de la desactivació...",
  deactivating: "Desactivant...",
  deactivateMemberBtn: "Desactivar Soci",

  // Payments
  paymentType: "Tipus",
  amount: "Import",
  concept: "Concepte",
  paymentDate: "Data de pagament",
  receiptNumber: "Número de rebut",
  registerPayment: "Registrar Pagament",

  // Payment Types
  paymentPlot: "Parcel·la",
  paymentMaterial: "Material",
  paymentRental: "Lloguer",

  // Payment Filters
  searchPayments: "Buscar per soci, DNI, parcel·la o concepte...",
  filterByType: "Filtrar per tipus",
  allTypes: "Tots els tipus",
  year: "Any",
  all: "Tots",

  // Reports
  reportsTitle: "Informes i Exportacions",
  reportsDescription: "Genera i descarrega informes del sistema",
  generateReport: "Generar Informe",
  exportExcel: "Exportar a Excel",
  downloadingReport: "Descarregant informe...",
  
  // Report Types
  membersReport: "Informe de Socis",
  plotsReport: "Informe de Parcel·les", 
  paymentsReport: "Informe de Pagaments",
  annualReport: "Informe Anual",
  pendingPaymentsReport: "Pagaments Pendents",

  // Auth
  accessSystem: "Accés al Sistema",
  accessDescription: "Inicia sessió o registra't per accedir",
  signIn: "Iniciar Sessió",
  signUp: "Registrar-se",
  fullName: "Nom Complet",
  password: "Contrasenya",
  signingIn: "Iniciant sessió...",
  signingUp: "Registrant...",
  createAccount: "Crear Compte",
  fullNamePlaceholder: "El teu nom complet",

  // Common
  cancel: "Cancel·lar",
  save: "Guardar",
  edit: "Editar",
  delete: "Eliminar",
  close: "Tancar",
  search: "Cercar",
  filter: "Filtrar",
  export: "Exportar",
  loading: "Carregant...",
  noData: "No hi ha dades",
  error: "Error",
  success: "Èxit",
  confirm: "Confirmar",
  yes: "Sí",
  no: "No",

  // Error Messages
  errorCreatingPlot: "Error al crear la parcel·la",
  errorUpdatingPlot: "Error al actualitzar la parcel·la",
  errorDeletingPlot: "Error al eliminar la parcel·la",
  errorAssigningPlot: "Error al assignar la parcel·la",
  errorUnassigningPlot: "Error al desassignar la parcel·la",
  errorCreatingMember: "Error al crear el soci",
  errorUpdatingMember: "Error al actualitzar el soci",
  errorDeactivatingMember: "Error al desactivar el soci",

  // Success Messages
  plotCreated: "Parcel·la creada exitosament",
  plotUpdated: "Parcel·la actualitzada exitosament",
  plotDeleted: "Parcel·la eliminada exitosament",
  plotAssigned: "Parcel·la assignada exitosament",
  plotUnassigned: "Parcel·la desassignada exitosament",
  memberCreated: "Soci creat exitosament",
  memberUpdated: "Soci actualitzat exitosament",
  memberDeactivated: "Soci desactivat exitosament",
  contractGenerated: "Contracte PDF generat i descarregat exitosament",

  // 404 Page
  pageNotFound: "Pàgina no trobada",
  pageNotFoundMessage: "Ups! Pàgina no trobada",
  backToHome: "Tornar a l'inici",

  // Red Flags
  incident: "Incidència",
  newIncident: "Nova Incidència",
  incidentTitle: "Títol",
  incidentDescription: "Descripció (opcional)",
  createIncident: "Crear Incidència",
};
