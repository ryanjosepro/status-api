module.exports = app => {
    const general = app.src.api.general;
    const passport = app.src.config.passport;
    const auth = app.src.api.auth;
    const users = app.src.api.users;

    app.post('/signup', auth.signup);
    app.post('/signin', auth.signin);
    app.post('/validate', auth.validate);

    app.use('*', passport.authenticate());
    
    //Admin
    app.route('/users')
    .all(users.authAdmin)
    .get(users.get)
    .post(users.insert);

    //User
    app.route('/users/:id')
    .all(users.authId)
    .get(users.getById)
    .put(users.edit)
    .delete(users.remove);
    
    app.use('*', general.routeNotFound);
}