import cluster from 'cluster';
import { v4 as uuidv4 } from 'uuid';
import { IUser, IUserData } from '../types/index';

export interface IAppData {
  users: Array<IUser>;
  getUsers: () => Promise<Array<IUser>>;
  getUser: (id: string) => Promise<IUser | null>;
  createUser: (options: IUserData) => Promise<IUser>;
  deleteUser: (id: string) => Promise<boolean>;
  updateUser: (id: string, options: IUserData) => Promise<IUser | null>;
}

class AppData implements IAppData {
  users: Array<IUser>;

  constructor() {
    this.users = [];
  }

  private getUserIndex = (id: string): number => {
    return this.users.findIndex((user: IUser) => user.id === id);
  };

  getUsers = async (): Promise<Array<IUser>> => {
    return this.users;
  };

  getUser = async (id: string): Promise<IUser | null> => {
    const needUserIndex = this.getUserIndex(id);
    if (needUserIndex > -1) {
      return this.users[needUserIndex];
    }
    return null;
  };

  createUser = async ({ username, age, hobbies }: IUserData): Promise<IUser> => {
    const newUser = {
      id: uuidv4(),
      username,
      age,
      hobbies,
    };

    this.users.push(newUser);

    return newUser;
  };

  deleteUser = async (id: string): Promise<boolean> => {
    const needUserIndex = this.getUserIndex(id);
    if (needUserIndex > -1) {
      this.users = [...this.users.slice(0, needUserIndex), ...this.users.slice(needUserIndex + 1)];
      return true;
    }
    return false;
  };

  updateUser = async (id: string, { username, age, hobbies }: IUserData): Promise<IUser | null> => {
    const needUserIndex = this.getUserIndex(id);
    if (needUserIndex > -1) {
      this.users = [
        ...this.users.slice(0, needUserIndex),
        {
          ...this.users[needUserIndex],
          username,
          age,
          hobbies,
        },
        ...this.users.slice(needUserIndex + 1),
      ];
      return this.users[needUserIndex];
    }

    return null;
  };
}

export default new AppData();
