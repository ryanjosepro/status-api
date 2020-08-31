module.exports = app => {
    const routeNotFound = (rq, rs) => {
        return rs.send({
            status: 'ERROR',
            msg: 'Route not found!',
            time: new Date
        });
    }
    
    return {routeNotFound};
}