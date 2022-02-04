const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const TokenManagerTableTestHelper = require('../../../../tests/TokenManagerTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and new comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'Dicoding Academy Indonesia',
      };

      const server = await createServer(container);
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/comments',
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
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
    });

    it('should response 400 if comment payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/comments',
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
      expect(responseJson.message).toEqual('harus mengirimkan content');
    });

    it('should response 400 if comment payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        content: 1234,
      };

      const server = await createServer(container);
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/comments',
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
      expect(responseJson.message).toEqual('content, threadId dan userId harus string');
    });
  });

  // DELETE
  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 when comment success deleted', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/comments/comment-123',
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 if user is not verified', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();
      await UsersTableTestHelper.addUser({ id: 'user-132', username: 'johndoe' });
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'marry' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-132' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-321' });

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/comments/comment-123',
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak untuk akses resource ini!');
    });

    it('should response 404 if route not registered', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/commentss/comment-123',
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('resource tidak tersedia!');
    });
  });
});
