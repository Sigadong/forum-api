const LikeCommentRepository = require('../../../Domains/likes/LikeCommentRepository');
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
        likeCount: 0,
        content: 'Dicoding Academy Indonesia',
      },
      {
        id: 'comment-132',
        username: 'dicoding_aws',
        date: '2022-02-02',
        likeCount: 0,
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

    // const like = 3;

    const likeComment = [
      {
        id: 'comment-123',
        username: 'aws.dicoding',
        date: '2022-02-02',
        content: 'Dicoding Academy Indonesia',
        likeCount: 4,
        replies: repliesCommentByThread,
      },
      {
        id: 'comment-132',
        username: 'dicoding_aws',
        date: '2022-02-02',
        content: 'Dicoding Academy',
        likeCount: 2,
        replies: repliesCommentByThread,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesCommentRepository = new RepliesCommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    mockThreadRepository.getDetailThread = jest.fn(() => Promise.resolve(detailThreadPayload));
    mockCommentRepository.getCommentByThread = jest.fn(() => Promise.resolve(commentByThread));
    mockRepliesCommentRepository.getRepliesCommentByThread = jest.fn(() => Promise.resolve(repliesCommentByThread));
    mockLikeCommentRepository.getLikeCountByCommentId = jest.fn((commentId) => Promise.resolve(commentId === 'comment-123' ? 4 : 2));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      repliesCommentRepository: mockRepliesCommentRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    getDetailThreadUseCase._getLikeComment = jest.fn(() => Promise.resolve(likeComment));

    // Action
    const getDetailThread = await getDetailThreadUseCase.execute({ threadId: detailThreadPayload.id });

    expect(getDetailThread.id).toEqual(detailThreadPayload.id);
    expect(getDetailThread.title).toEqual(detailThreadPayload.title);
    expect(getDetailThread.body).toEqual(detailThreadPayload.body);
    expect(getDetailThread.date).toEqual(detailThreadPayload.date);
    expect(getDetailThread.username).toEqual(detailThreadPayload.username);
    expect(getDetailThread.comments).toEqual(likeComment);
    expect(mockThreadRepository.getDetailThread)
      .toBeCalledWith(detailThreadPayload.id);
    expect(mockCommentRepository.getCommentByThread)
      .toBeCalledWith(detailThreadPayload.id);
    expect(mockRepliesCommentRepository.getRepliesCommentByThread)
      .toBeCalledWith(detailThreadPayload.id);
    expect(getDetailThreadUseCase._getLikeComment)
      .toBeCalledWith(commentByThread);
  });
});
