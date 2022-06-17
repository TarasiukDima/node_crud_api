import { ServerResponse } from 'http';
import { STATUS_CODES_APP } from '../settings.js';


export const NOT_FOUND_MESSAGE = 'Not Founded!';
export const INVALID_REQUEST_MESSAGE = 'Invalid request!';
export const INVALID_BODY_REQUEST_MESSAGE = 'Invalid request. Body does not contain required fields';

export const getStringBodyAnswer = (body: object): string => JSON.stringify(body);

export const getErrorMessage = (message: string): string => {
  return getStringBodyAnswer({
    message,
    status: STATUS_CODES_APP.bad,
  });
};

export const sendNotFoundMessage = (res: ServerResponse, message: string = NOT_FOUND_MESSAGE) => {
  const bodyAnswer = getErrorMessage(message);

  res.statusCode = STATUS_CODES_APP.bad;
  res.end(bodyAnswer);
};

export const sendErrorMessage = (
  res: ServerResponse,
  status: number,
  message: string = INVALID_REQUEST_MESSAGE
) => {
  const bodyAnswer = getStringBodyAnswer({
    message,
    status,
  });

  res.statusCode = status;
  res.end(bodyAnswer);
};

export const sendBody = (
  res: ServerResponse,
  status: number,
  body: object
) => {
  const bodyAnswer = getStringBodyAnswer(body);

  res.statusCode = status;
  res.end(bodyAnswer);
};