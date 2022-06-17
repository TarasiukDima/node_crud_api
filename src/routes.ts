import { IncomingMessage, ServerResponse } from 'http';
import { processingUsersRequest } from './routeAllUsers.js';
import { processingOneUserRequest } from './routeOneUser.js';
import { getUrlWithoutPart } from './utils/index.js';
import { sendNotFoundMessage } from './utils/messages.js';
import { TMethodsRequest } from './types/index.js';
import { START_URL, URL_USERS } from './settings.js';

export const processingRequest = (req: IncomingMessage, res: ServerResponse): void => {
  res.setHeader('Content-Type', 'application/json');

  if (!req.url?.startsWith(START_URL)) {
    sendNotFoundMessage(res);
    return;
  }

  const url = getUrlWithoutPart(req.url, START_URL);

  if (!url.startsWith(URL_USERS)) {
    sendNotFoundMessage(res);
    return;
  }
  const urlPoint = getUrlWithoutPart(url, URL_USERS);
  const method: TMethodsRequest = (req.method as TMethodsRequest) || 'GET';

  if (!urlPoint.length || urlPoint === '/') {
    processingUsersRequest(req, res, method);
    return;
  }

  processingOneUserRequest(req, res, method);
  return;
};
