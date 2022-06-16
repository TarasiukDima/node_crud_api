import { v4 as uuidv4 } from 'uuid';
import { IUser, IUserData } from './types';

interface IAppData {
  users: Array<IUser>
}

class AppData implements IAppData {
  users: Array<IUser>;

  constructor() {
    this.users = [];
  }

  private getUserIndex = (id: string): number => {
    return this.users.findIndex((user: IUser) => user.id === id);
  }

  getUsers = (): Array<IUser> => {
    return this.users;
  }

  getUser = (id: string): IUser | null => {

    const needUserIndex = this.getUserIndex(id);
    if (needUserIndex > -1) {
      return this.users[needUserIndex]
    }
    return null;
  }

  createUser = (options: IUserData): IUser => {
    const newUser = {
      id: uuidv4(),
      ...options,
    }

    this.users.push(newUser);

    return newUser;
  }

  apiDeleteUser = (id: string): null | 'ok' => {
    const needUserIndex = this.getUserIndex(id);
    if (needUserIndex > -1) {
      this.users = [
        ...this.users.slice(0, needUserIndex),
        ...this.users.slice(needUserIndex + 1),
      ]
      return 'ok'
    }
    return null;
  }

  apiUpdateUser = (id: string, options: IUserData): IUser | null => {
    const needUserIndex = this.getUserIndex(id);
    if (needUserIndex > -1) {
      this.users = [
        ...this.users.slice(0, needUserIndex),
        {
          ...this.users[needUserIndex],
          ...options,
        },
        ...this.users.slice(needUserIndex + 1),
      ]
      return this.users[needUserIndex]
    }

    return null;
  }
}

export default new AppData();