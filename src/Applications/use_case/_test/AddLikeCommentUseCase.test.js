const NewLikeComment = require('../../../Domains/likes/entities/NewLikeComment');
const LikeCommentRepository = require('../../../Domains/likes/LikeCommentRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddLikeCommentUseCase = require('../AddLikeCommentUseCase');

describe('AddLikeCommentUseCase', () => {
  // Added Like Comment
  it('should orchestrating the add comment action correctly when like does not exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockLikeCommentRepository = new LikeCommentRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockLikeCommentRepository.checkAvailabilityLikeComment = jest.fn(() => Promise.resolve(false));
    mockLikeCommentRepository.addLikeComment = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const addLikeComment = new AddLikeCommentUseCase({
      likeCommentRepository: mockLikeCommentRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await addLikeComment.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeCommentRepository.addLikeComment).toBeCalledWith(new NewLikeComment({
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    }));
  });

  // Delete Like Comment
  it('should orchestrating the delete comment action correctly when like does exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockLikeCommentRepository = new LikeCommentRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockLikeCommentRepository.checkAvailabilityLikeComment = jest.fn(() => Promise.resolve(true));
    mockLikeCommentRepository.deleteLikeByCommentIdAndOwner = jest.fn(() => Promise.resolve());
    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const addLikeComment = new AddLikeCommentUseCase({
      likeCommentRepository: mockLikeCommentRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await addLikeComment.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeCommentRepository.deleteLikeByCommentIdAndOwner).toBeCalledWith(new NewLikeComment({
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    }));
  });
});
