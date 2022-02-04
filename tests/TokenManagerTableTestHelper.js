/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('./AuthenticationsTableTestHelper');

const TokenManagerTableTestHelper = {
  async getAccessToken() {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    const refreshToken = Jwt.token.generate({ username: 'dicoding', id: 'user-123' }, process.env.REFRESH_TOKEN_KEY);
    await AuthenticationsTableTestHelper.addToken(refreshToken);
    const accessToken = Jwt.token.generate({ username: 'dicoding', id: 'user-123' }, process.env.ACCESS_TOKEN_KEY);
    return accessToken;
  },
};

module.exports = TokenManagerTableTestHelper;
