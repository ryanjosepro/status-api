module.exports = app => {
    const infoAPI = (rq, rs) => {
        return rs.send(
        `
        PayFor API 1.0

        POST -> /register
        body:
        -username;
        -email;
        -password;
        -firstname;
        -lastname;

        POST -> /login
        body:
        -email;
        -password;
        `
        )
    }

    const routeNotFound = (rq, rs) => {
        return rs.send({
            status: 'ERROR',
            msg: 'Route not found!',
            time: new Date
        });
    }
    
    return {infoAPI, routeNotFound};
}