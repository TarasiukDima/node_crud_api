import { keysUserBody } from '../settings.js';
import { IUserData } from '../types/index.js';

export const getUrlWithoutPart = (url: string, partNotNeed: string): string => {
  const lastPartUrlArray = url.split(partNotNeed);
  return lastPartUrlArray.filter((pathUrl: string) => pathUrl.length)[0] || '';
};

export const returnObjFromBody = (body: string): IUserData | null => {
  let answer;

  try {
    answer = JSON.parse(body);
  } catch (_) {
    answer = null;
  }

  return answer;
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
