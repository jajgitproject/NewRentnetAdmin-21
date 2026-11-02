export class KaptureTicket {
  kaptureTicketId: number;
  ticketId: string;
  emailSubject: string;
  customerEmail: string;
  ticketCreatedOn: string;
  ticketStatus: string;
  ticketSubStatus: string;
  assignedAgent: string;
  folderCategory: string;
  queueDetails: string;
  createdOn: string;

  constructor(row: any) {
    this.kaptureTicketId = Number(row.kaptureTicketId || row.KaptureTicketId || 0);
    this.ticketId = row.ticketId || row.TicketId || '';
    this.emailSubject = row.emailSubject || row.EmailSubject || '';
    this.customerEmail = row.customerEmail || row.CustomerEmail || '';
    this.ticketCreatedOn = row.ticketCreatedOn || row.TicketCreatedOn || '';
    this.ticketStatus = row.ticketStatus || row.TicketStatus || '';
    this.ticketSubStatus = row.ticketSubStatus || row.TicketSubStatus || '';
    this.assignedAgent = row.assignedAgent || row.AssignedAgent || '';
    this.folderCategory = row.folderCategory || row.FolderCategory || '';
    this.queueDetails = row.queueDetails || row.QueueDetails || '';
    this.createdOn = row.createdOn || row.CreatedOn || '';
  }
}
