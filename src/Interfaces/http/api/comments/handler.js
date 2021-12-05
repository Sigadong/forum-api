const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deteleCommentHandler = this.deteleCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { content } = request.payload;
    const { id: credentialUserId } = request.auth.credentials;
    const { threadId, any } = request.params;

    if (any !== 'comments') {
      throw new NotFoundError('resource tidak tersedia!');
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

  // del
  async deteleCommentHandler(request) {
    const { threadId, any, commentId } = request.params;
    const { id: credentialUserId } = request.auth.credentials;

    if (any !== 'comments') {
      throw new NotFoundError('resource tidak tersedia!');
    }

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({ commentId, threadId, owner: credentialUserId });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
