import AppData from './dataBase.js';
import { IncomingMessage, ServerResponse } from 'http';
import { keysUserBody, STATUS_CODES_APP } from './settings.js';
import {
  INVALID_BODY_REQUEST_MESSAGE,
  sendBody,
  sendErrorMessage,
  sendNotFoundMessage,
} from './utils/messages.js';
import { IUserData, TMethodsRequest } from './types/index.js';

const returnObjFromBody = (body: string): IUserData => {
  if (typeof body === 'string') {
    return JSON.parse(body);
  }

  return body;
};

const checkDataUser = (body: string): IUserData | null => {
  const newUserInfo = returnObjFromBody(body);

  for (const [key, value] of keysUserBody) {
    if (!(key in newUserInfo) && value !== typeof newUserInfo[key as keyof IUserData]) {
      return null;
    }
  }

  return newUserInfo;
};

export const processingUsersRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  method: TMethodsRequest
) => {
  if (method === 'GET') {
    sendBody(res, STATUS_CODES_APP.good, AppData.getUsers());
    return;
  }

  if (method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const userInfo = checkDataUser(body);

        if (userInfo) {
          const addingUser = AppData.createUser(userInfo);
          sendBody(res, STATUS_CODES_APP.good, addingUser);
        } else {
          sendErrorMessage(res, STATUS_CODES_APP.invalid, INVALID_BODY_REQUEST_MESSAGE);
        }
      } catch (_) {
        sendErrorMessage(res, STATUS_CODES_APP.invalid, INVALID_BODY_REQUEST_MESSAGE);
      }

      return;
    });

    return;
  }

  sendNotFoundMessage(res, 'Not good method!');
  return;
};
