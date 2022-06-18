import { IncomingMessage, ServerResponse } from 'http';
import { processingUsersRequest } from './routeAllUsers.js';
import { processingOneUserRequest } from './routeOneUser.js';
import { getUrlWithoutPart } from '../utils/index.js';
import { TMethodsRequest } from '../types/index.js';
import { START_URL, STATUS_CODES_APP, URL_USERS } from '../settings.js';
import { NOT_FOUND_MESSAGE, sendErrorMessage } from '../utils/messages.js';

const returnUrlWithoutStart = (url: string, startPart: string) => {
  if (!url?.startsWith(startPart)) {
    return null;
  }

  return getUrlWithoutPart(url, startPart);
};

const getPointUrl = (url: string) => {
  const lastPartUrl = returnUrlWithoutStart(url, START_URL);
  if (!lastPartUrl) {
    return null;
  }

  return returnUrlWithoutStart(lastPartUrl, URL_USERS);
};

export const processingRequest = (req: IncomingMessage, res: ServerResponse): void => {
  const urlPoint = getPointUrl(req.url || '');
  const method: TMethodsRequest = (req.method as TMethodsRequest) || 'GET';

  res.setHeader('Content-Type', 'application/json');

  if (urlPoint === null) {
    sendErrorMessage(res, STATUS_CODES_APP.bad, NOT_FOUND_MESSAGE);
    return;
  }

  if (!urlPoint.length || urlPoint === '/') {
    processingUsersRequest(req, res, method);
    return;
  }

  processingOneUserRequest(req, res, method, urlPoint);
  return;
};
