const LikesCommentTableTestHelper = require('../../../../tests/LikesCommentTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewLikeComment = require('../../../Domains/likes/entities/NewLikeComment');
const pool = require('../../database/postgres/pool');
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres');

describe('LikeCommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-321' });
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'aws' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-321' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123' });
  });

  afterEach(async () => {
    await LikesCommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await LikesCommentTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLikeComment function', () => {
    it('should persist add like comment and return added like comment correctly', async () => {
      // Arrange
      const newLikeComment = new NewLikeComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addLikeComment = await likeCommentRepositoryPostgres.addLikeComment(newLikeComment);

      // Assert
      const likeComment = await LikesCommentTableTestHelper.findLikeByCommentIdAndOwner(newLikeComment);
      expect(likeComment[0]).toStrictEqual({ id: 'like-123', comment_id: 'comment-123', owner: 'user-123' });
      expect(addLikeComment).toStrictEqual({ id: 'like-123' });
    });
  });

  describe('checkAvailabilityLikeComment function', () => {
    it('should return value true when liked comment are found based on commentId and owner', async () => {
      // Arrange
      const newLikeComment = new NewLikeComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-321',
      });
      await LikesCommentTableTestHelper.addLikeComment({ commentId: 'comment-123', owner: 'user-321' });

      const fakeIdGenerator = () => '123'; // stub!
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const checkLikeComment = await likeCommentRepositoryPostgres.checkAvailabilityLikeComment(newLikeComment);

      // Assert
      const likeComment = await LikesCommentTableTestHelper.findLikeByCommentIdAndOwner(newLikeComment);
      expect(likeComment).toHaveLength(1);
      expect(checkLikeComment).toEqual(true);
    });

    it('should return value false when liked comment are not found based on commentId and owner', async () => {
      // Arrange
      const newLikeComment = new NewLikeComment({
        threadId: 'thread-123',
        commentId: 'comment-1234',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const checkLikeComment = await likeCommentRepositoryPostgres.checkAvailabilityLikeComment(newLikeComment);

      // Assert
      const likeComment = await LikesCommentTableTestHelper.findLikeByCommentIdAndOwner(newLikeComment);
      expect(likeComment).toHaveLength(0);
      expect(checkLikeComment).toEqual(false);
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should get the number of likes of the comment based on the commentId and have a value of one', async () => {
      // Arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: 'user-1234', username: '_devs' });
      await LikesCommentTableTestHelper.addLikeComment({ commentId, owner: 'user-1234' });

      const fakeIdGenerator = () => '123'; // stub!
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const getLikeCount = await likeCommentRepositoryPostgres.getLikeCountByCommentId(commentId);

      // Assert
      expect(getLikeCount).toEqual(1);
    });

    it('should get the number of likes of the comment based on the commentId and have a value of zero', async () => {
      // Arrange
      const commentId = 'comment-1324';
      const fakeIdGenerator = () => '123'; // stub!
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const getLikeCount = await likeCommentRepositoryPostgres.getLikeCountByCommentId(commentId);

      // Assert
      expect(getLikeCount).toEqual(0);
    });
  });

  describe('deleteLikeByCommentIdAndOwner function', () => {
    it('should delete like comment from database', async () => {
      // Arrange
      const newLikeComment = new NewLikeComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeCommentRepositoryPostgres.deleteLikeByCommentIdAndOwner(newLikeComment);

      // Assert
      const likeComment = await LikesCommentTableTestHelper.findLikeByCommentIdAndOwner(newLikeComment);
      expect(likeComment).toHaveLength(0);
    });
  });
});
