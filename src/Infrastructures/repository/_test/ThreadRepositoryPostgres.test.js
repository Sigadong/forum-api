const InvariantError = require('../../../Commons/exceptions/InvariantError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should return added thread correctly', async () => {
      // Arrange
      const threadPayload = new NewThread({
        title: 'Dicoding',
        body: 'Dicoding Academy',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(threadPayload);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Dicoding',
        owner: 'user-123',
      }));
    });

    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const threadPayload = new NewThread({
        title: 'Dicoding',
        body: 'Dicoding Academy',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(threadPayload);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(addedThread.id).toBeDefined();
      expect(addedThread.title).toBeDefined();
      expect(addedThread.owner).toBeDefined();
    });
  });

  // checkAvailabilityThread
  describe('checkAvailabilityThread function', () => {
    it('should throw NotFoundError if threadId not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      // Action & Assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread('thread-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if threadId available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread('thread-123'))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  // getDetailThread
  describe('getDetailThread function', () => {
    it('should persist and return get thread correctly', async () => {
      // Arrange
      const threadId = 'thread-123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId });

      // Action
      const getThread = await threadRepositoryPostgres.getDetailThread(threadId);

      // Assert
      expect(getThread.id).toBe(threadId);
    });

    it('should throw NotFoundError if threadId not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      // Action & Assert
      await expect(threadRepositoryPostgres.getDetailThread('thread-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw InvariantError if threadId available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      await expect(threadRepositoryPostgres.getDetailThread('thread-123'))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
