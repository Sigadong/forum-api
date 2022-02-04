const DetailRepliesComment = require('../DetailRepliesComment');

describe('a DetailRepliesComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'johndoe',
      date: '2022-02-02',
      content: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new DetailRepliesComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: {},
      date: [],
      content: true,
      isDelete: 321,
    };

    // Action and Assert
    expect(() => new DetailRepliesComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailRepliesComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'replies-123',
      username: 'johndoe',
      date: '2022-02-02',
      content: 'Dicoding Indonesia',
      isDelete: false,
    };

    // Action
    const detailRepliesComment = new DetailRepliesComment(payload);

    // Assert
    expect(detailRepliesComment.id).toEqual(payload.id);
    expect(detailRepliesComment.username).toEqual(payload.username);
    expect(detailRepliesComment.date).toEqual(payload.date);
    expect(detailRepliesComment.content).toEqual(payload.content);
  });

  it('should create DetailRepliesComment object correctly when isDelete value is true', () => {
    // Arrange
    const payload = {
      id: 'replies-123',
      username: 'johndoe',
      date: '2022-02-02',
      content: 'Dicoding Indonesia',
      isDelete: true,
    };

    // Action
    const detailRepliesComment = new DetailRepliesComment(payload);

    // Assert
    expect(detailRepliesComment.id).toEqual(payload.id);
    expect(detailRepliesComment.username).toEqual(payload.username);
    expect(detailRepliesComment.date).toEqual(payload.date);
    expect(detailRepliesComment.content).toEqual('**balasan telah dihapus**');
  });
});
