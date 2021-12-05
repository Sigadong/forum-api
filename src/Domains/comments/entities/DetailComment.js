class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = (!payload.isDelete) ? payload.content : '**komentar telah dihapus**';
  }

  _verifyPayload({ id, username, date, content }) {
    for (const item of [id, username, date, content]) {
      if (!item)
        throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      if (typeof item !== 'string')
        throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
