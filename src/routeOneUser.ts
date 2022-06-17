import AppData from './dataBase.js';
import { IncomingMessage, ServerResponse } from 'http';
import { STATUS_CODES_APP } from './settings.js';
import { getStringBodyAnswer } from './utils/messages.js';
import { TMethodsRequest } from './types/index.js';

export const processingOneUserRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  method: TMethodsRequest
) => {
  if (method === 'GET') {
    // const bodyAnswer = getStringBodyAnswer(AppData.getUsers());

    // res.statusCode = STATUS_CODES_APP.good;
    // res.end(bodyAnswer);
    res.end('lol1');
    return;
  }

  res.end('lol2');
};
