export interface IUserData {
  username: string;
  age: number;
  hobbies: Array<string>;
}

export interface IUser extends IUserData {
  id: string;
}

export interface IErrorMessage {
  message: string;
  status: 404;
}

export type TMethodsRequest = 'GET' | 'POST' | 'PUT' | 'DELETE';