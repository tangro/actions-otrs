import * as core from '@actions/core';
import { OtrsTicketUrlInformation, OtrsTicket } from './types';

const escapeText = (text: string): string =>
  text.replace(/\//g, '\\/').replace(/\./g, '\\.');

export const getOtrsTicketsFromText = (
  text: string
): OtrsTicketUrlInformation[] => {
  const baseUrl = core.getInput('otrs-url');
  const baseUrlRegex = core.getInput('otrs-url-regex') || baseUrl;
  const urlRegexp = new RegExp(
    `${escapeText(baseUrlRegex)}\\?.*TicketID=(\\d+).*(&notified=true)?`,
    'gm'
  );

  const ticketIdRegex = new RegExp('http.*TicketID=(\\d+).*(notified=true)?');

  let tempUrl: RegExpExecArray | null;
  let urlInfos: OtrsTicketUrlInformation[] = [];

  while ((tempUrl = urlRegexp.exec(text)) !== null) {
    const url = tempUrl[0];
    const maybeId = ticketIdRegex.exec(url);

    if (maybeId !== null) {
      const id = maybeId[1];

      const urlInfo = {
        url,
        id
      };

      urlInfos = [...urlInfos, urlInfo];
    }
  }

  return urlInfos;
};

export const prettifyUrlInText = (
  text: string,
  ticket: OtrsTicket,
  ticketUrlInfo: OtrsTicketUrlInformation
): string => {
  return text.replace(
    ticketUrlInfo.url,
    // prettier-ignore
    `[OTRS Ticket#${ticket.TicketID}: ${ticket.Title}](${ticketUrlInfo.url}&notified=true)`
  );
};
