module.exports = (port, callback) => {
    const consign = require('consign');

    const app = require('express')();

    app.db = require('./config/db.js');

    consign()
        .include('./src/config/passport.js')
        .then('./src/config/middlewares.js')
        .then('./src/utils')
        .then('./src/api')
        .then('./src/config/routes.js')
        .into(app);

    app.listen(port, callback);
}