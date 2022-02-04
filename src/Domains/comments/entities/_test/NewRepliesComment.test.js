const NewRepliesComment = require('../NewRepliesComment');

describe('a RepliesComment entites', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewRepliesComment(payload)).toThrowError('REPLIES_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: {},
      commentId: [],
      owner: true,
    };

    // Action and Assert
    expect(() => new NewRepliesComment(payload)).toThrowError('REPLIES_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newRepliesComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'Dicoding Academy Indonesia',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const newRepliesComment = new NewRepliesComment(payload);

    // Assert
    expect(newRepliesComment.content).toEqual(payload.content);
    expect(newRepliesComment.threadId).toEqual(payload.threadId);
    expect(newRepliesComment.commentId).toEqual(payload.commentId);
    expect(newRepliesComment.owner).toEqual(payload.owner);
  });
});
