import fetch from 'node-fetch';
import querystring from 'querystring';
import * as core from '@actions/core';

export const fetchWrapper = async (
  url: string,
  options: { [key: string]: string | number | boolean }
) => {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') as string;
    if (contentType.startsWith('application/json')) {
      const data = await response.json();
      return data;
    } else {
      const data = await response.text();
      return data;
    }
  } catch (error) {
    core.error(error);
    throw error;
  }
};

export const Ticket = async (
  ticketID: string,
  options: { [key: string]: any }
) => {
  const auth = {
    UserLogin: process.env.OTRS_USERNAME,
    Password: process.env.OTRS_PASSWORD
  };
  const otrsUrlRest = core.getInput('otrs-url-rest');

  return fetchWrapper(
    `${otrsUrlRest}/Ticket/${ticketID}?${querystring.stringify({
      ...auth,
      ...options
    })}`,
    {}
  );
};

export const TicketUpdate = async (ticketID: string, data: object) => {
  const auth = {
    UserLogin: process.env.OTRS_USERNAME,
    Password: process.env.OTRS_PASSWORD
  };
  const otrsUrlRest = core.getInput('otrs-url-rest');

  return fetchWrapper(
    `${otrsUrlRest}/Ticket/${ticketID}?${querystring.stringify(auth)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data)
    }
  );
};
