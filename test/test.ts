import request from 'supertest';
import 'dotenv/config';
import { addNewServer } from '../src/index';
import { IUserData } from '../src/types/index';
import { URL_USERS, START_URL, STATUS_CODES_APP } from '../src/settings';
import {
  getNotFoundUserMessage,
  getInvalidUserMessage,
  NOT_FOUND_MESSAGE,
} from '../src/utils/messages';

const createMockUserData = (
  username: string = 'MockUser1',
  age: number = 30,
  hobbies: Array<string> = []
): IUserData => ({
  username,
  age,
  hobbies,
});

const PORT_FOR_TESTING = 3030 || process.env.PORT;
const server = request(addNewServer(undefined, PORT_FOR_TESTING));

describe('scenario 1', () => {
  let newUserId: string;
  const MOCK_USER = createMockUserData('MockUser1', 30, ['codding']);
  const MOCK_USER_UPDATE = createMockUserData('MockUser2', 10, []);

  test('get empty array users', async (): Promise<void> => {
    const answer = await server.get(START_URL + URL_USERS);

    expect(answer.body).toEqual([]);
    expect(answer.statusCode).toEqual(STATUS_CODES_APP.good);
  });

  test('create new user', async (): Promise<void> => {
    const answer = await server.post('/api/users').send(MOCK_USER);
    const body = answer.body;
    newUserId = answer.body.id || '';

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.add);
    expect(body.username).toEqual(MOCK_USER.username);
    expect(body.age).toEqual(MOCK_USER.age);
    expect(body.hobbies).toEqual(MOCK_USER.hobbies);
  });

  test('get info new user', async (): Promise<void> => {
    const answer = await server.get(`${START_URL + URL_USERS}/${newUserId}`);
    const body = answer.body;

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.good);
    expect(body.username).toEqual(MOCK_USER.username);
    expect(body.age).toEqual(MOCK_USER.age);
    expect(body.hobbies).toEqual(MOCK_USER.hobbies);
  });

  test('update new user info', async (): Promise<void> => {
    const answer = await server.put(`${START_URL + URL_USERS}/${newUserId}`).send(MOCK_USER_UPDATE);
    const body = answer.body;

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.good);
    expect(body.username).toEqual(MOCK_USER_UPDATE.username);
    expect(body.age).toEqual(MOCK_USER_UPDATE.age);
    expect(body.hobbies).toEqual(MOCK_USER_UPDATE.hobbies);
  });

  test('delete created user', async (): Promise<void> => {
    const answer = await server.delete(`${START_URL + URL_USERS}/${newUserId}`);
    expect(answer.statusCode).toEqual(STATUS_CODES_APP.delete);
    expect(answer.body).toEqual('');
  });

  test('get deleted user info', async (): Promise<void> => {
    const answer = await server.get(`${START_URL + URL_USERS}/${newUserId}`);
    const message = getNotFoundUserMessage(newUserId);
    const body = answer.body;

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.bad);
    expect(body.message).toEqual(message);
    expect(body.status).toEqual(STATUS_CODES_APP.bad);
  });
});

describe('scenario 2', () => {
  let newUserId1: string;
  let newUserId2: string;
  const MOCK_USER1 = createMockUserData('FakeUser 1', 30, ['drawing']);
  const MOCK_USER2 = createMockUserData('FakeUser 2', 60, ['drinking']);
  const MOCK_USER_UPDATE = createMockUserData('Normal User', 40, ['signing', 'flying']);

  test('create first user', async (): Promise<void> => {
    const answer = await server.post('/api/users').send(MOCK_USER1);
    const body = answer.body;
    newUserId1 = answer.body.id || '';

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.add);
    expect(body.username).toEqual(MOCK_USER1.username);
    expect(body.age).toEqual(MOCK_USER1.age);
    expect(body.hobbies).toEqual(MOCK_USER1.hobbies);
  });

  test('create second user', async (): Promise<void> => {
    const answer = await server.post('/api/users').send(MOCK_USER2);
    const body = answer.body;
    newUserId2 = answer.body.id || '';

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.add);
    expect(body.username).toEqual(MOCK_USER2.username);
    expect(body.age).toEqual(MOCK_USER2.age);
    expect(body.hobbies).toEqual(MOCK_USER2.hobbies);
  });

  test('get array users', async (): Promise<void> => {
    const answer = await server.get(START_URL + URL_USERS);

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.good);

    expect(answer.body[0].username).toEqual(MOCK_USER1.username);
    expect(answer.body[0].age).toEqual(MOCK_USER1.age);
    expect(answer.body[0].hobbies).toEqual(MOCK_USER1.hobbies);

    expect(answer.body[1].username).toEqual(MOCK_USER2.username);
    expect(answer.body[1].age).toEqual(MOCK_USER2.age);
    expect(answer.body[1].hobbies).toEqual(MOCK_USER2.hobbies);
  });

  test('update first user info', async (): Promise<void> => {
    const answer = await server
      .put(`${START_URL + URL_USERS}/${newUserId1}`)
      .send(MOCK_USER_UPDATE);
    const body = answer.body;

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.good);
    expect(body.username).toEqual(MOCK_USER_UPDATE.username);
    expect(body.age).toEqual(MOCK_USER_UPDATE.age);
    expect(body.hobbies).toEqual(MOCK_USER_UPDATE.hobbies);
  });

  test('update second user info', async (): Promise<void> => {
    const answer = await server
      .put(`${START_URL + URL_USERS}/${newUserId2}`)
      .send(MOCK_USER_UPDATE);
    const body = answer.body;

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.good);
    expect(body.username).toEqual(MOCK_USER_UPDATE.username);
    expect(body.age).toEqual(MOCK_USER_UPDATE.age);
    expect(body.hobbies).toEqual(MOCK_USER_UPDATE.hobbies);
  });

  test('get array updated users', async (): Promise<void> => {
    const answer = await server.get(START_URL + URL_USERS);

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.good);

    expect(answer.body[0].username).toEqual(MOCK_USER_UPDATE.username);
    expect(answer.body[0].age).toEqual(MOCK_USER_UPDATE.age);
    expect(answer.body[0].hobbies).toEqual(MOCK_USER_UPDATE.hobbies);

    expect(answer.body[1].username).toEqual(MOCK_USER_UPDATE.username);
    expect(answer.body[1].age).toEqual(MOCK_USER_UPDATE.age);
    expect(answer.body[1].hobbies).toEqual(MOCK_USER_UPDATE.hobbies);
  });

  test('delete first user', async (): Promise<void> => {
    const answer = await server.delete(`${START_URL + URL_USERS}/${newUserId1}`);
    expect(answer.statusCode).toEqual(STATUS_CODES_APP.delete);
    expect(answer.body).toEqual('');
  });

  test('delete second user', async (): Promise<void> => {
    const answer = await server.delete(`${START_URL + URL_USERS}/${newUserId2}`);
    expect(answer.statusCode).toEqual(STATUS_CODES_APP.delete);
    expect(answer.body).toEqual('');
  });
});

describe('scenario 3', () => {
  const MOCK_ID = '370f7241-5197-43b8-9d3d-0c3331846902';
  const MOCK_USER_UPDATE = createMockUserData('MockUser2', 10, []);
  let newUserId: string;

  test('get info not created user 404', async (): Promise<void> => {
    const answer = await server.get(`${START_URL + URL_USERS}/${MOCK_ID}`);
    const message = getNotFoundUserMessage(MOCK_ID);
    const body = answer.body;

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.bad);
    expect(body.message).toEqual(message);
    expect(body.status).toEqual(STATUS_CODES_APP.bad);
  });

  test('get invalid id user 400', async (): Promise<void> => {
    const answer = await server.get(`${START_URL + URL_USERS}/${newUserId}`);
    const message = getInvalidUserMessage(newUserId);
    const body = answer.body;

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.invalid);
    expect(body.message).toEqual(message);
    expect(body.status).toEqual(STATUS_CODES_APP.invalid);
  });

  test('get bad route 404', async (): Promise<void> => {
    const answer = await server.get('/another/route');
    const body = answer.body;

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.bad);
    expect(body.message).toEqual(NOT_FOUND_MESSAGE);
    expect(body.status).toEqual(STATUS_CODES_APP.bad);
  });

  test('update not created user info 404', async (): Promise<void> => {
    const answer = await server.put(`${START_URL + URL_USERS}/${MOCK_ID}`).send(MOCK_USER_UPDATE);
    const message = getNotFoundUserMessage(MOCK_ID);
    const body = answer.body;

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.bad);
    expect(body.message).toEqual(message);
    expect(body.status).toEqual(STATUS_CODES_APP.bad);
  });

  test('get array users 200', async (): Promise<void> => {
    const answer = await server.get(START_URL + URL_USERS);

    expect(answer.statusCode).toEqual(STATUS_CODES_APP.good);
    expect(answer.body).toEqual([]);
  });
});
