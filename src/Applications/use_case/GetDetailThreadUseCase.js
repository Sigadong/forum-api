class GetDetailThreadUseCase {
  constructor({
    commentRepository,
    threadRepository,
    repliesCommentRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._repliesCommentRepository = repliesCommentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { threadId } = useCasePayload;
    const detailThread = await this._threadRepository.getDetailThread(threadId);
    const commentsThread = await this._commentRepository.getCommentByThread(threadId);
    const replies = await this._repliesCommentRepository.getRepliesCommentByThread(threadId);

    const comments = commentsThread.map((comment) => ({ ...comment, replies }));

    return { ...detailThread, comments };
  }

  _validatePayload({ threadId }) {
    if (!threadId)
      throw new Error('THREAD_ID_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof threadId !== 'string')
      throw new Error('THREAD_ID_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = GetDetailThreadUseCase;
