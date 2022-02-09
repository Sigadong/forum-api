const NewLikeComment = require('../../Domains/likes/entities/NewLikeComment');

class AddLikeCommentUseCase {
  constructor({ likeCommentRepository, commentRepository, threadRepository }) {
    this._likeCommentRepository = likeCommentRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  // eslint-disable-next-line consistent-return
  async execute(useCasePayload) {
    const { threadId, commentId } = useCasePayload;
    const newLikeComment = new NewLikeComment(useCasePayload);
    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);

    if (await this._likeCommentRepository.checkAvailabilityLikeComment(newLikeComment)) {
      await this._likeCommentRepository.deleteLikeByCommentIdAndOwner(newLikeComment);
      return 0;
    }
    await this._likeCommentRepository.addLikeComment(newLikeComment);
  }
}

module.exports = AddLikeCommentUseCase;
