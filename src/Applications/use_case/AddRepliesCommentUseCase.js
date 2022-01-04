const NewRepliesComment = require('../../Domains/comments/entities/NewRepliesComment');

class AddRepliesCommentUseCase {
  constructor({ repliesCommentRepository, commentRepository, threadRepository }) {
    this._repliesCommentRepository = repliesCommentRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newRepliesComment = new NewRepliesComment(useCasePayload);
    await this._threadRepository.checkAvailabilityThread(newRepliesComment.threadId);
    await this._commentRepository.checkAvailabilityComment(newRepliesComment.commentId);
    return this._repliesCommentRepository.addRepliesComment(newRepliesComment);
  }
}

module.exports = AddRepliesCommentUseCase;
