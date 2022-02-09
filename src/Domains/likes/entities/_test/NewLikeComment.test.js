const NewLikeComment = require('../NewLikeComment');

describe('a NewLikeComment entites', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewLikeComment(payload)).toThrowError('NEW_LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: [],
      commentId: {},
      owner: 123,
    };

    // Action and Assert
    expect(() => new NewLikeComment(payload)).toThrowError('NEW_LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const newLikeComment = new NewLikeComment(payload);

    // Assert
    expect(newLikeComment.threadId).toEqual(payload.threadId);
    expect(newLikeComment.commentId).toEqual(payload.commentId);
    expect(newLikeComment.owner).toEqual(payload.owner);
  });
});
