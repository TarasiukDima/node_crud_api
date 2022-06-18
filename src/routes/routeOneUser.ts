import AppData from '../database/database.js';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';
import { STATUS_CODES_APP } from '../settings.js';
import {
  INVALID_BODY_REQUEST_MESSAGE,
  getInvalidUserMessage,
  NOT_FOUND_MESSAGE,
  getNotFoundUserMessage,
  sendBody,
  sendErrorMessage,
  USER_DELETED_MESSAGE,
  INVALID_METHOD_MESSAGE,
} from '../utils/messages.js';
import { IUser, IUserData, TMethodsRequest } from '../types/index.js';
import { checkDataUser } from '../utils/index.js';

const checkIdUserUrl = (url: string): string | null => {
  const userId = url.split('/');
  const arrayWithPaths = userId.filter((urlPath) => urlPath.length);

  if (arrayWithPaths.length > 1) {
    return null;
  }

  return arrayWithPaths[0];
};

const validateUserId = (userId: string): boolean => {
  return uuidValidate(userId) && uuidVersion(userId) === 4;
};

const updateUserInfo = (req: IncomingMessage, res: ServerResponse, userId: string): void => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const userInfo = checkDataUser(body);

      if (userInfo) {
        const options: IUserData = {
          username: userInfo.username,
          hobbies: userInfo.hobbies,
          age: userInfo.age,
        };

        const addingUser = AppData.updateUser(userId, options);
        sendBody(res, STATUS_CODES_APP.good, addingUser as IUser);
      } else {
        throw new Error('');
      }
    } catch (_) {
      sendErrorMessage(res, STATUS_CODES_APP.invalid, INVALID_BODY_REQUEST_MESSAGE);
    }
    return;
  });
};

const deleteUser = (res: ServerResponse, userId: string): void => {
  const isUserDeleted = AppData.deleteUser(userId);
  if (isUserDeleted) {
    sendBody(res, STATUS_CODES_APP.delete, { message: USER_DELETED_MESSAGE });
  } else {
    sendErrorMessage(res, STATUS_CODES_APP.bad, getNotFoundUserMessage(userId));
  }
};

export const processingOneUserRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  method: TMethodsRequest,
  urlPoint: string
) => {
  const userId = checkIdUserUrl(urlPoint);

  if (!userId) {
    sendErrorMessage(res, STATUS_CODES_APP.bad, NOT_FOUND_MESSAGE);
    return;
  }

  if (!validateUserId(userId)) {
    sendErrorMessage(res, STATUS_CODES_APP.invalid, getInvalidUserMessage(userId));
    return;
  }

  const needUser = AppData.getUser(userId);

  if (!needUser) {
    sendErrorMessage(res, STATUS_CODES_APP.bad, getNotFoundUserMessage(userId));
    return;
  }

  switch (method) {
    case 'GET': {
      sendBody(res, STATUS_CODES_APP.good, needUser as IUser);
      break;
    }
    case 'PUT': {
      updateUserInfo(req, res, userId);
      break;
    }
    case 'DELETE': {
      deleteUser(res, userId);
      break;
    }
    default:
      sendErrorMessage(res, STATUS_CODES_APP.bad, INVALID_METHOD_MESSAGE);
      break;
  }
};
