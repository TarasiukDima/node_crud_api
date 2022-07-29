import AppData from '../database/database';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';
import { STATUS_CODES_APP } from '../settings';
import {
  INVALID_BODY_REQUEST_MESSAGE,
  getInvalidUserMessage,
  NOT_FOUND_MESSAGE,
  getNotFoundUserMessage,
  sendBody,
  sendErrorMessage,
  USER_DELETED_MESSAGE,
  INVALID_METHOD_MESSAGE,
  SERVER_ERROR_BODY,
} from '../utils/messages';
import { IUser, IUserData, TMethodsRequest } from '../types/index';
import { checkDataUser, getBodyFromData } from '../utils/index';

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

const updateUserInfo = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
): Promise<void> => {
  try {
    const body = await getBodyFromData(req);
    const userInfo = checkDataUser(body);

    if (userInfo) {
      const options: IUserData = {
        username: userInfo.username,
        hobbies: userInfo.hobbies,
        age: userInfo.age,
      };

      AppData.updateUser(userId, options)
        .then((addingUser) => {
          sendBody(res, STATUS_CODES_APP.good, addingUser as IUser);
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
  return;
};

const deleteUser = (res: ServerResponse, userId: string): void => {
  AppData.deleteUser(userId)
    .then((isUserDeleted) => {
      if (isUserDeleted) {
        sendBody(res, STATUS_CODES_APP.delete, { message: USER_DELETED_MESSAGE });
      } else {
        sendErrorMessage(res, STATUS_CODES_APP.bad, getNotFoundUserMessage(userId));
      }
    })
    .catch(() => {
      sendBody(res, STATUS_CODES_APP.serverError, SERVER_ERROR_BODY);
    });
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

  const needUser = await AppData.getUser(userId);

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
