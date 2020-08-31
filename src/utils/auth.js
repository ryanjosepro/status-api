const {authSecret} = require('../.env');
const jwt = require('jwt-simple');

module.exports = app => {
    const encode = payload => {
        return jwt.encode(payload, authSecret);
    }

    const decode = token => {
        return jwt.decode(token, authSecret);
    }

    const decodeBearerToken = token => {
        return decode(token.split(' ')[1]);
    }

    return {encode, decode, decodeBearerToken};
}