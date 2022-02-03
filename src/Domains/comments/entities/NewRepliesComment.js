class NewRepliesComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.owner = payload.owner;
  }

  _verifyPayload({ content, threadId, commentId, owner }) {
    for (const key of [content, threadId, commentId, owner]) {
      if (!key)
        throw new Error('REPLIES_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      if (typeof key !== 'string')
        throw new Error('REPLIES_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewRepliesComment;
