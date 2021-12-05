const pool = require('../../database/postgres/pool');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const TokenManagerTableTestHelper = require('../../../../tests/TokenManagerTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and new thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding',
        body: 'Dicoding Indonesia',
      };
      const server = await createServer(container);
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
    });

    it('should response 400 if thread payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        body: 'Dicoding Indonesia',
      };

      const server = await createServer(container);
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan title dan body');
    });

    it('should response 400 if thread payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        title: 123,
        body: true,
      };
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('title dan body harus string');
    });
  });

  // GET DETAIL THREAD
  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and get detail thread', async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', isDelete: true });
      await CommentsTableTestHelper.addComment({ id: 'comment-132' });

      // Action
      const response = await server.inject({
        url: '/threads/thread-123',
        method: 'GET',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBeDefined();
    });

    it('should response 404 if route not registered or thread not available', async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      // Action
      const response = await server.inject({
        url: '/threads/thread-321',
        method: 'GET',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan!');
    });
  });
});
