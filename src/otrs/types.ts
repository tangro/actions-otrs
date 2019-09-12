export interface OtrsTicketUrlInformation {
  id: string;
  url: string;
}

// there are many more fields, these are just the ones being needed right now
// https://doc.otrs.com/doc/api/otrs/stable/Perl/Kernel/System/Ticket.pm.html#TicketGet
export interface OtrsTicket {
  TicketID: string;
  TicketNumber: string;
  Title: string;
  Url: string;
}
