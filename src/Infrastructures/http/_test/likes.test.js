const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const TokenManagerTableTestHelper = require('../../../../tests/TokenManagerTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesCommentTableTestHelper = require('../../../../tests/LikesCommentTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-1234', username: '_developers' });
    await UsersTableTestHelper.addUser({ id: 'user-1243', username: '_awsdicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-1234' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-1243' });
  });

  afterEach(async () => {
    await LikesCommentTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  // PUT likes
  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when like comment success', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/comments/comment-123/likes',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 when not liked comment success', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();
      await LikesCommentTableTestHelper.addLikeComment({ commentId: 'comment-123' });

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/comments/comment-123/likes',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 if route not registered or thread not available', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        url: '/threads/thread-12345/comments/comment-123/likes',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan!');
    });

    it('should response 404 if route not registered or comment not available', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await TokenManagerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/comments/comment-12345/likes',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan!');
    });
  });
});
