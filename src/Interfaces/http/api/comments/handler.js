const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddRepliesCommentUseCase = require('../../../../Applications/use_case/AddRepliesCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const DeleteRepliesCommentUseCase = require('../../../../Applications/use_case/DeleteRepliesCommentUseCase');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.postRepliesCommentHandler = this.postRepliesCommentHandler.bind(this);
    this.deteleCommentHandler = this.deteleCommentHandler.bind(this);
    this.deteleRepliesCommentHandler = this.deteleRepliesCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { content } = request.payload;
    const { id: credentialUserId } = request.auth.credentials;
    const { threadId } = request.params;

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

  async postRepliesCommentHandler(request, h) {
    const { content } = request.payload;
    const { id: credentialUserId } = request.auth.credentials;
    const { threadId, commentId, any } = request.params;

    if (any !== 'comments') throw new NotFoundError('resource tidak tersedia!');

    const addRepliesCommentUseCase = this._container.getInstance(AddRepliesCommentUseCase.name);
    const addedReply = await addRepliesCommentUseCase
      .execute({ content, threadId, commentId, owner: credentialUserId });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deteleRepliesCommentHandler(request) {
    const { threadId, any, commentId, repliesId } = request.params;
    const { id: credentialUserId } = request.auth.credentials;

    if (any !== 'comments') throw new NotFoundError('resource tidak tersedia!');

    const deleteRepliesCommentUseCase = this._container.getInstance(DeleteRepliesCommentUseCase.name);
    await deleteRepliesCommentUseCase.execute({ commentId, threadId, repliesId, owner: credentialUserId });

    return {
      status: 'success',
    };
  }

  async deteleCommentHandler(request) {
    const { threadId, any, commentId } = request.params;
    const { id: credentialUserId } = request.auth.credentials;

    if (any !== 'comments') throw new NotFoundError('resource tidak tersedia!');

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({ commentId, threadId, owner: credentialUserId });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
