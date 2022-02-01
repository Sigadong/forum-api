const LikeCommentRepository = require('../../Domains/likes/LikeCommentRepository');

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLikeComment({ commentId, owner }) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id',
      values: [id, commentId, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async checkAvailabilityLikeComment({ commentId, owner }) {
    const query = {
      text: 'SELECT 1 FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      return true;
    }
    return false;
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*)::int FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    // console.log(result.rows[0].count);
    return result.rows[0].count;
  }

  async deleteLikeByCommentIdAndOwner({ commentId, owner }) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2 RETURNING id',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }
}

module.exports = LikeCommentRepositoryPostgres;
