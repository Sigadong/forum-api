const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/{any}',
    handler: handler.postCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
