const CommentRepository = require('../../../Domains/comments/CommentRepository');
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
    const expectedGetCommentByThread = [
      {
        id: 'comment-132',
        username: 'aws.dicoding',
        date: '20211011',
        content: 'Dicoding Academy Indonesia',
        is_delete: true,
      },
      {
        id: 'comment-123',
        username: 'dicoding_aws',
        date: '20211012',
        content: 'AWS X Dicoding',
        is_delete: false,
      },
    ];

    const detailThreadPayload = {
      id: 'thread-123',
      title: 'Dicoding Indonesia',
      body: 'Dicoding Academy',
      username: 'dicoding',
      date: '19561211',
      comments: expectedGetCommentByThread,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(detailThreadPayload));
    mockCommentRepository.getCommentByThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetCommentByThread));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const getDetailThread = await getDetailThreadUseCase
      .execute({ threadId: detailThreadPayload.id });

    // Assert
    expect(getDetailThread).toStrictEqual(detailThreadPayload);
    expect(mockThreadRepository.getDetailThread)
      .toBeCalledWith(detailThreadPayload.id);
    expect(mockCommentRepository.getCommentByThread)
      .toBeCalledWith(detailThreadPayload.id);
  });
});
