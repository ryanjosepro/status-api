module.exports = app => {
    const general = app.src.api.general;
    const passport = app.src.config.passport;
    const auth = app.src.api.auth;
    const users = app.src.api.users;

    app.get('/info', general.infoAPI);
    app.post('/register', auth.register);
    app.post('/login', auth.login);
    app.post('/validate', auth.validate);

    //Admin
    app.route('/users')
    .all(passport.authenticate())
    .all(users.authAdmin)
    .get(users.get)
    .post(users.insert);

    //User
    app.route('/users/:id')
    .all(passport.authenticate())
    .all(users.authId)
    .get(users.getById)
    .put(users.edit)
    .delete(users.remove);
    
    app.use('*', general.routeNotFound);
}