const CommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'commentss',
  register: async (server, { container }) => {
    const commentsHandler = new CommentsHandler(container);
    server.route(routes(commentsHandler));
  },
};
