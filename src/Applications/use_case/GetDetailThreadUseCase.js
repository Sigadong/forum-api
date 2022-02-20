class GetDetailThreadUseCase {
  constructor({
    commentRepository,
    threadRepository,
    repliesCommentRepository,
    likeCommentRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._repliesCommentRepository = repliesCommentRepository;
    this._likeCommentRepository = likeCommentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { threadId } = useCasePayload;
    const detailThread = await this._threadRepository.getDetailThread(threadId);
    const replies = await this._repliesCommentRepository.getRepliesCommentByThread(threadId);
    const commentsThread = await this._commentRepository.getCommentByThread(threadId);
    const likeComment = await this._getLikeComment(commentsThread);
    const comments = likeComment.map((comment) => ({ ...comment, replies }));

    return { ...detailThread, comments };
  }

  _validatePayload({ threadId }) {
    if (!threadId)
      throw new Error('THREAD_ID_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof threadId !== 'string')
      throw new Error('THREAD_ID_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  }

  async _getLikeComment(comments) {
    for (let index = 0; index < comments.length; index += 1) {
      const commentId = comments[index].id;
      comments[index].likeCount = await this._likeCommentRepository
        .getLikeCountByCommentId(commentId);
    }
    return comments;
  }
}

module.exports = GetDetailThreadUseCase;
