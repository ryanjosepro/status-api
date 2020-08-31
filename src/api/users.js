module.exports = app => {
    const general = app.src.utils.general;
    const auth = app.src.utils.auth;
    const security = app.src.utils.security;
    const {existsOrError, notExistsOrError, equalsOrError, onlyNumbersOrError} = app.src.utils.validation;

    //Admin

    const authAdmin = async (rq, rs, next) => {
        try {
            const payload = auth.decodeBearerToken(rq.headers.authorization);

            let adminFromDb = await app.db('users').select('admin').where({id: payload.id}).first();

            if (adminFromDb) {
                next();
            } else {
                rs.status(401).json({status: 'ERROR', msg: 'Usuário sem permissão de administrador!'});
            }
        } catch(error) {
            return rs.status(400).json({status: 'ERROR', msg: 'Token inválido!'});
        }
    }

    const get = async (rq, rs) => {
        const selectFields = ['id', 'active', 'admin', 'username', 'email', 'firstname', 'lastname', 'created_at', 'updated_at'];

        app.db('users')
        .select(selectFields)
        .where({active: true})
        .then(res => rs.json({status: 'OK', users: res}).send())
        .catch(err => rs.status(500).json({status: 'ERROR', msg: err.detail}).send());
    }

    const insert = async (rq, rs) => {
        let user = {...rq.body};

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

    //User

    const authId = async (rq, rs, next) => {
        try {
            let payload = {};

            try {
                payload = auth.decodeBearerToken(rq.headers.authorization);
            } catch {
                return rs.status(400).json({status: 'ERROR', msg: 'Token inválido!'});
            }

            onlyNumbersOrError(rq.params.id, 'Id inválido!');

            let userFromDb = await app.db('users').select('id', 'admin').where({id: rq.params.id}).first();
            existsOrError(userFromDb, 'Usuário inexistente!');

            if (!userFromDb.admin) {
                equalsOrError(rq.params.id, payload.id, 'Id não autorizado!');
            }

            next();
        } catch(error) {
            return rs.status(400).json({status: 'ERROR', msg: error});
        }
    }

    const getById = async (rq, rs) => {
        const selectFields = ['id', 'active', 'admin', 'username', 'email', 'firstname', 'lastname', 'created_at', 'updated_at'];

        app.db('users')
        .select(selectFields)
        .where({id: rq.params.id})
        .first()
        .then(res => rs.status(200).json({status: 'OK', user: res}).send())
        .catch(err => rs.status(500).json({status: 'ERROR', msg: err.detail}).send());
    }

    const edit = async (rq, rs) => {
        const userParams = ['username','email','password','firstname','lastname'];

        let user = general.extractObjectParams({...rq.body}, userParams);

        user.password = security.encrypt(user.password);

        user.updated_at = new Date;
            
        app.db('users').update(user)
        .where({id: rq.params.id})
        .then(() => rs.status(200).json({status: 'OK', msg: 'Usuário atualizado!'}).send())
        .catch(err => rs.status(500).json({status: 'ERROR', msg: err.detail}).send());
    }

    const remove = async (rq, rs) => {
        app.db('users').delete().where({id: rq.params.id})
        .then(() => rs.status(200).json({status: 'OK', msg: 'Usuário desativado!'}).send())
        .catch(err => rs.status(500).json({status: 'ERROR', msg: err.detail}).send());
    }
    
    //Coming soon
    
    const active = async (rq, rs) => {
        
    }
    
    return {authAdmin, authId, get, getById, insert, edit, remove};
}