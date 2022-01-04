const NewRepliesComment = require('../../../Domains/comments/entities/NewRepliesComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const RepliesCommentRepository = require('../../../Domains/comments/RepliesCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddRepliesCommentUseCase = require('../AddRepliesCommentUseCase');

describe('AddRepliesUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Dicoding Academy Indonesia',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const expectedAddedRepliesComment = new AddedComment({
      id: 'replies-123',
      content: 'Dicoding Academy Indonesia',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockRepliesCommentRepository = new RepliesCommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockRepliesCommentRepository.addRepliesComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedRepliesComment));
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getRepliesCommentUseCase = new AddRepliesCommentUseCase({
      commentRepository: mockCommentRepository,
      repliesCommentRepository: mockRepliesCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedRepliesComment = await getRepliesCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedRepliesComment).toStrictEqual(expectedAddedRepliesComment);
    expect(mockThreadRepository.checkAvailabilityThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockRepliesCommentRepository.addRepliesComment).toBeCalledWith(new NewRepliesComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    }));
  });
});
