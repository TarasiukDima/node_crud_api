export interface IUserData {
  username: string;
  age: number;
  hobbies: Array<string>;
}

export interface IUser extends IUserData {
  id: string;
}