module.exports = app => {
    const general = app.src.utils.general;
    const auth = app.src.utils.auth;
    const security = app.src.utils.security;
    const {existsOrError, notExistsOrError, onlyNumbersOrError} = app.src.utils.validation;

    const register = async (rq, rs) => {
        const userParams = ['username','email','password','firstname','lastname'];

        let user = general.extractObjectParams({...rq.body}, userParams);

        //validation
        try {
            existsOrError(user.username, 'Nome de usuário inválido!');
            existsOrError(user.email, 'Email inválido!');
            existsOrError(user.password, 'Senha inválida!');

            let usernameFromDb = await app.db('users').select('username').where({username: user.username}).first();
            let emailFromDb = await app.db('users').select('email').where({email: user.email}).first();
            notExistsOrError(usernameFromDb, 'Nome de usuário já existente!');
            notExistsOrError(emailFromDb, 'Email já existente!');
        } catch(error) {
            return rs.status(400).json({status: 'ERROR', msg: error}).send();
        }

        user.password = security.encrypt(user.password);

        app.db('users').insert(user)
        .then(() => rs.status(200).json({status: 'OK', msg: 'Usuário inserido!'}).send())
        .catch(err => rs.status(500).json({status: 'ERROR', msg: err.detail}).send());
    }

    const login = async (rq, rs) => {
        let user = {...rq.body};
        let userFromDb = {};

        try {
            existsOrError(user.email, 'Email inválido!');
            existsOrError(user.password, 'Senha inválida!');

            userFromDb = await app.db('users')
            .select('id', 'username', 'email', 'password')
            .where({email: user.email}).first();

            existsOrError(userFromDb, 'Email/Senha incorretos!');

            if (!security.compare(user.password, userFromDb.password)) {
                throw 'Email/Senha incorretos!';
            }
        } catch(error) {
            return rs.status(400).json({status: 'ERROR', msg: error}).send();
        }

        delete userFromDb.password;

        const now = Math.floor(Date.now() / 1000);

        const payload = {
            ...userFromDb,
            iat: now,
            exp: now + 60 * 60 * 24 * 3
            // segundos * minutos * horas * dias
        }

        rs.status(200)
        .json({
            status: 'OK',
            msg: 'Login efetuado com sucesso!',
            user: userFromDb,
            authorization: {
                iat: payload.iat,
                ext: payload.exp,
                token: auth.encode(payload)
            }
        }).send();
    }

    const validate = async (rq, rs) => {
        try {
            auth.decodeBearerToken(rq.headers.authorization);

            return rs.send(true);
        } catch(error) {

        }

        rs.send(false);
    }

    return {register, login, validate};
}