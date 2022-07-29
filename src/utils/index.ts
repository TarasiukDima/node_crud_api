import { IncomingMessage } from 'http';
import { keysUserBody } from '../settings';
import { IUserData } from '../types/index';

export const getUrlWithoutPart = (url: string, partNotNeed: string): string => {
  const lastPartUrlArray = url.split(partNotNeed);
  return lastPartUrlArray.filter((pathUrl: string) => pathUrl.length)[0] || '';
};

export const returnObjFromBody = (body: string): IUserData | null => {
  try {
    return JSON.parse(body);
  } catch (_) {
    return null;
  }
};

export const checkDataUser = (body: string): IUserData | null => {
  const newUserInfo = returnObjFromBody(body);

  if (!newUserInfo) {
    return null;
  }

  for (const [key, value] of keysUserBody) {
    if (!(key in newUserInfo) || value !== typeof newUserInfo[key as keyof IUserData]) {
      return null;
    }
  }

  return newUserInfo;
};

export const getBodyFromData = (req: IncomingMessage): Promise<string> => {
  return new Promise((res, rej) => {
    let body = '';

    try {
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        res(body);
      });
    } catch (_) {
      rej();
    }
  });
};
