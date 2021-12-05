const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/{any}',
    handler: handler.postCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/{any}/{commentId}',
    handler: handler.deteleCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
