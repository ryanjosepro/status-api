const bcrypt = require('bcryptjs');

module.exports = app => {
    
    const encrypt = text => {
        return bcrypt.hashSync(text, 12);
    }

    const compare = (text, hash) => {
        return bcrypt.compareSync(text, hash);
    }

    return {encrypt, compare};
}