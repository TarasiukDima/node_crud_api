import AppData from '../database/database.js';
import { IncomingMessage, ServerResponse } from 'http';
import { STATUS_CODES_APP } from '../settings.js';
import {
  INVALID_BODY_REQUEST_MESSAGE,
  INVALID_METHOD_MESSAGE,
  sendBody,
  sendErrorMessage,
} from '../utils/messages.js';
import { checkDataUser } from '../utils/index.js';
import { TMethodsRequest } from '../types/index.js';

const addNewUser = (req: IncomingMessage, res: ServerResponse): void => {
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
        throw new Error('');
      }
    } catch (_) {
      sendErrorMessage(res, STATUS_CODES_APP.invalid, INVALID_BODY_REQUEST_MESSAGE);
    }
  });
};

export const processingUsersRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  method: TMethodsRequest
) => {
  switch (method) {
    case 'GET': {
      sendBody(res, STATUS_CODES_APP.good, AppData.getUsers());
      break;
    }
    case 'POST': {
      addNewUser(req, res);
      break;
    }
    default: {
      sendErrorMessage(res, STATUS_CODES_APP.bad, INVALID_METHOD_MESSAGE);
      break;
    }
  }
};
