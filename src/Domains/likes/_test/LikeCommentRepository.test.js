const LikeCommentRepository = require('../LikeCommentRepository');

describe('LikeCommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeCommentRepository = new LikeCommentRepository();

    // Action and Assert
    await expect(likeCommentRepository.addLikeComment({})).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeCommentRepository.checkAvailabilityLikeComment({})).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeCommentRepository.getLikeCountByCommentId('')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeCommentRepository.deleteLikeByCommentIdAndOwner({})).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
