const RepliesCommentRepository = require('../../../Domains/comments/RepliesCommentRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteRepliesCommentUseCase = require('../DeleteRepliesCommentUseCase');

describe('DeleteRepliesCommentUseCase', () => {
  it('should throw error if use case payload not contain repliesId, commentId, threadId and owner', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteRepliesCommentUseCase = new DeleteRepliesCommentUseCase({});

    // Action & Assert
    await expect(deleteRepliesCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLIES_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if repliesId, commentId, threadId and owner not string', async () => {
    // Arrange
    const useCasePayload = {
      repliesId: 123,
      threadId: {},
      commentId: true,
      owner: [],
    };
    const deleteRepliesCommentUseCase = new DeleteRepliesCommentUseCase({});

    // Action & Assert
    await expect(deleteRepliesCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLIES_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete replies that comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      repliesId: 'replies-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesCommentRepository = new RepliesCommentRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockRepliesCommentRepository.verifyRepliesCommentOwner = jest.fn(() => Promise.resolve());
    mockRepliesCommentRepository.deleteRepliesComment = jest.fn(() => Promise.resolve());

    const deleteRepliesCommentUseCase = new DeleteRepliesCommentUseCase({
      repliesCommentRepository: mockRepliesCommentRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteRepliesCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockRepliesCommentRepository.verifyRepliesCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.repliesId, useCasePayload.owner);
    expect(mockRepliesCommentRepository.deleteRepliesComment)
      .toHaveBeenCalledWith(useCasePayload.repliesId);
  });
});
