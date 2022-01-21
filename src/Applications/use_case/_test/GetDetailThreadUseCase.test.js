const CommentRepository = require('../../../Domains/comments/CommentRepository');
const RepliesCommentRepository = require('../../../Domains/comments/RepliesCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should throw error if use case payload not contain value needed', async () => {
    // Arrange
    const useCasePayload = {};
    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    // Action & Assert
    await expect(getDetailThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('THREAD_ID_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if property value not string', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 1234,
    };
    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    // Action & Assert
    await expect(getDetailThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('THREAD_ID_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating get detail thread action correctly', async () => {
    // Arrange
    const detailThreadPayload = {
      id: 'thread-123',
      title: 'Dicoding Indonesia',
      body: 'Dicoding Academy',
      username: 'dicoding',
      date: '2022-02-02',
    };

    const commentByThread = [
      {
        id: 'comment-123',
        username: 'aws.dicoding',
        date: '2022-02-02',
        content: 'Dicoding Academy Indonesia',
      },
      {
        id: 'comment-132',
        username: 'dicoding_aws',
        date: '2022-02-02',
        content: 'Dicoding Academy',
      },
    ];

    const repliesCommentByThread = [
      {
        id: 'replies-132',
        username: 'jhon',
        date: '2022-02-04',
        content: 'Hai marry!',
      },
      {
        id: 'replies-123',
        username: 'marry',
        date: '2022-02-03',
        content: 'Hello, Jhon!',
      },
    ];

    const comments = [
      {
        id: 'comment-123',
        username: 'aws.dicoding',
        date: '2022-02-02',
        content: 'Dicoding Academy Indonesia',
        replies: repliesCommentByThread,
      },
      {
        id: 'comment-132',
        username: 'dicoding_aws',
        date: '2022-02-02',
        content: 'Dicoding Academy',
        replies: repliesCommentByThread,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesCommentRepository = new RepliesCommentRepository();

    mockThreadRepository.getDetailThread = jest.fn(() => Promise.resolve(detailThreadPayload));
    mockCommentRepository.getCommentByThread = jest.fn(() => Promise.resolve(commentByThread));
    mockRepliesCommentRepository.getRepliesCommentByThread = jest.fn(() => Promise.resolve(repliesCommentByThread));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      repliesCommentRepository: mockRepliesCommentRepository,
    });

    // Action
    const getDetailThread = await getDetailThreadUseCase
      .execute({ threadId: detailThreadPayload.id });
    // Assert
    expect(getDetailThread.id).toEqual(detailThreadPayload.id);
    expect(getDetailThread.title).toEqual(detailThreadPayload.title);
    expect(getDetailThread.body).toEqual(detailThreadPayload.body);
    expect(getDetailThread.date).toEqual(detailThreadPayload.date);
    expect(getDetailThread.username).toEqual(detailThreadPayload.username);
    expect(getDetailThread.comments).toEqual(comments);
    expect(mockThreadRepository.getDetailThread)
      .toBeCalledWith(detailThreadPayload.id);
    expect(mockCommentRepository.getCommentByThread)
      .toBeCalledWith(detailThreadPayload.id);
    expect(mockRepliesCommentRepository.getRepliesCommentByThread)
      .toBeCalledWith(detailThreadPayload.id);
  });
});
