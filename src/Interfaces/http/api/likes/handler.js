const AddLikeCommentUseCase = require('../../../../Applications/use_case/AddLikeCommentUseCase');

class LikeCommentHandler {
  constructor(container) {
    this._container = container;

    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async putLikeCommentHandler(request, h) {
    const { id: credentialUserId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const likeCommentUseCase = this._container.getInstance(AddLikeCommentUseCase.name);
    await likeCommentUseCase.execute({ threadId, commentId, owner: credentialUserId });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikeCommentHandler;
