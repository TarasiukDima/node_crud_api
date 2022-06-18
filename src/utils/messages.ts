import { ServerResponse } from 'http';
import { STATUS_CODES_APP } from '../settings.js';

export const SERVER_ERROR_MESSAGE = 'Server error!';
export const NOT_FOUND_MESSAGE = 'Not Founded!';
export const INVALID_METHOD_MESSAGE = 'Invalid method!';
export const USER_DELETED_MESSAGE = 'User deleted!';
export const INVALID_REQUEST_MESSAGE = 'Invalid request!';
export const INVALID_BODY_REQUEST_MESSAGE =
  'Invalid request. Body does not contain required fields';

export const getNotFoundUserMessage = (id: string) => `User id-(${id}) not founded!`;
export const getInvalidUserMessage = (id: string) => `User id-(${id}) is invalid!`;

export const SERVER_ERROR_BODY = {
  message: SERVER_ERROR_MESSAGE,
  status: STATUS_CODES_APP.serverError,
};

export const getStringBodyAnswer = (body: object): string | null => {
  let strForBody: string | null;
  try {
    strForBody = JSON.stringify(body);
  } catch (_) {
    strForBody = null;
  }

  return strForBody;
};

export const sendBody = (res: ServerResponse, status: number, body: object) => {
  const bodyAnswer = getStringBodyAnswer(body);

  if (bodyAnswer) {
    res.statusCode = status;
    res.end(bodyAnswer);
    return;
  }

  sendBody(res, STATUS_CODES_APP.serverError, SERVER_ERROR_BODY);
};

export const sendErrorMessage = (
  res: ServerResponse,
  status: number,
  message: string = INVALID_REQUEST_MESSAGE
) => {
  sendBody(res, status, { message, status });
};