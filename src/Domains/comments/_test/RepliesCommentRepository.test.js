const RepliesCommentRepository = require('../RepliesCommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const repliesCommentRepository = new RepliesCommentRepository();

    // Action and Assert
    await expect(repliesCommentRepository.addRepliesComment({})).rejects.toThrowError('REPLIES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repliesCommentRepository.verifyRepliesCommentOwner('')).rejects.toThrowError('REPLIES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repliesCommentRepository.getRepliesCommentByThread('')).rejects.toThrowError('REPLIES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repliesCommentRepository.deleteRepliesComment('')).rejects.toThrowError('REPLIES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
