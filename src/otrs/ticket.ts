import * as OtrsApi from './api';
import { OtrsTicket } from './types';

export const getTicketInformation = async (
  ticketId: string
): Promise<OtrsTicket> => {
  const tickets = await OtrsApi.Ticket(ticketId, {
    DynamicFields: 1
  });
  const ticket = tickets.Ticket[0];

  return {
    ...ticket,
    Url: `${process.env.OTRS_TICKET_URL}${ticketId}`
  };
};

export const addNoteToTicket = async ({
  ticketId,
  subject,
  body
}: {
  ticketId: string;
  subject: string;
  body: string;
}) =>
  OtrsApi.TicketUpdate(ticketId, {
    TicketID: ticketId,
    Article: {
      ArticleType: 'note-internal',
      ArticleTypeID: '9',
      IsVisibleForCustomer: 0,
      Subject: subject,
      Body: `<html><body>${body}</body></html>`,
      ContentType: 'text/html; charset=utf8'
    }
  });
