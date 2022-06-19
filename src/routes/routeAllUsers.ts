import { IncomingMessage, ServerResponse } from 'http';
import AppData from '../database/database';
import { STATUS_CODES_APP } from '../settings';
import {
  INVALID_BODY_REQUEST_MESSAGE,
  INVALID_METHOD_MESSAGE,
  sendBody,
  sendErrorMessage,
  SERVER_ERROR_BODY,
} from '../utils/messages';
import { checkDataUser, getBodyFromData } from '../utils/index';
import { TMethodsRequest } from '../types/index';

const addNewUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const body = await getBodyFromData(req);
    const userInfo = checkDataUser(body);

    if (userInfo) {
      AppData.createUser(userInfo)
        .then((addingUser) => {
          sendBody(res, STATUS_CODES_APP.good, addingUser);
        })
        .catch(() => {
          sendBody(res, STATUS_CODES_APP.serverError, SERVER_ERROR_BODY);
        });
    } else {
      throw new Error('');
    }
  } catch (_) {
    sendErrorMessage(res, STATUS_CODES_APP.invalid, INVALID_BODY_REQUEST_MESSAGE);
  }
};

export const processingUsersRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  method: TMethodsRequest
) => {
  switch (method) {
    case 'GET': {
      const users = await AppData.getUsers();
      sendBody(res, STATUS_CODES_APP.good, users);
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
