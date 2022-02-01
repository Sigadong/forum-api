class LikeCommentRepository {
  async addLikeComment(addLikeComment) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkAvailabilityLikeComment(checkLikeComment) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikeCountByCommentId(commentId) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLikeByCommentIdAndOwner(deleteLikeComment) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeCommentRepository;
