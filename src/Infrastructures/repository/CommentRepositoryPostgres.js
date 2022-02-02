const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment({ content, threadId, owner }) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, threadId, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async checkAvailabilityComment(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount)
      throw new NotFoundError('comment tidak ditemukan!');
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount)
      throw new NotFoundError('comment tidak ditemukan!');

    const comment = result.rows[0];
    if (comment.owner !== owner)
      throw new AuthorizationError('Anda tidak berhak untuk akses resource ini!');
  }

  async deleteComment(commentId) {
    const isDelete = true;

    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2 RETURNING id',
      values: [isDelete, commentId],
    };

    await this._pool.query(query);
  }

  async getCommentByThread(threadId) {
    const query = {
      text: `SELECT comments.*, users.username AS username FROM comments 
            JOIN users ON comments.owner = users.id WHERE thread_id = $1 ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows
      .map((rowComment) => ({ ...new DetailComment({ ...rowComment, likeCount: 0, isDelete: rowComment.is_delete }) }));
  }
}

module.exports = CommentRepositoryPostgres;
