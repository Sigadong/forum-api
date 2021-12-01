class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.threadId = payload.threadId;
    this.owner = payload.owner;
  }

  _verifyPayload({ content, threadId, owner }) {
    if (!content) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!owner || typeof owner !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_AUTHENTICATED_USER');
    }

    if (!threadId || typeof threadId !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_THREAD');
    }
  }
}

module.exports = NewComment;
