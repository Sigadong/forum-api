/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addRepliesComment({
    id = 'replies-123', content = 'Dicoding Academy Indonesia', threadId = 'thread-123', commentId = 'comment-123', owner = 'user-123', isDelete = false,
  }) {
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, date, threadId, commentId, owner, isDelete],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },

  async findRepliesCommentById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
};

module.exports = RepliesTableTestHelper;
