const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { content } = request.payload;
    const { id: credentialUserId } = request.auth.credentials;
    const { threadId, any } = request.params;

    if (any !== 'comments') {
      throw new NotFoundError('thread resource tidak tersedia');
    }

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase
      .execute({ content, threadId, owner: credentialUserId });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CommentsHandler;
