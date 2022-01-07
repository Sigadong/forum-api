const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailRepliesComment = require('../../Domains/comments/entities/DetailRepliesComment');
const RepliesCommentRepository = require('../../Domains/comments/RepliesCommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class RepliesCommentRepositoryPostgres extends RepliesCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addRepliesComment({ content, threadId, commentId, owner }) {
    const id = `replies-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, date, threadId, commentId, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyRepliesCommentOwner(repliesId, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [repliesId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount)
      throw new NotFoundError('replies tidak ditemukan!');

    const replies = result.rows[0];
    if (replies.owner !== owner)
      throw new AuthorizationError('Anda tidak berhak untuk akses resource ini!');
  }

  async getRepliesCommentByThread(threadId) {
    const query = {
      text: `SELECT replies.*, users.username AS username FROM replies 
            JOIN users ON replies.owner = users.id WHERE thread_id = $1 ORDER BY replies.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    const replies = result.rows
      .map((rowReply) => (new DetailRepliesComment({ ...rowReply, isDelete: rowReply.is_delete })));
    return replies
      .map((reply) => ({ ...reply }));
  }

  async deleteRepliesComment(repliesId) {
    const isDelete = true;

    const query = {
      text: 'UPDATE replies SET is_delete = $1 WHERE id = $2 RETURNING id',
      values: [isDelete, repliesId],
    };

    await this._pool.query(query);
  }
}

module.exports = RepliesCommentRepositoryPostgres;
