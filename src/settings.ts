export const START_URL = '/api/';
export const URL_USERS = 'users';

export enum STATUS_CODES_APP {
  good = 200,
  add = 201,
  delete = 204,
  invalid = 400,
  bad = 404,
  serverError = 500,
}

export const keysUserBody: Array<[string, string]> = [
  ['username', 'string'],
  ['age', 'number'],
  ['hobbies', 'object'],
];
