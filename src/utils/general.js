module.exports = app => {
    const isNumber = val => /^\d+$/.test(val);

    const extractObjectParams = (object, params) => {
        let result = {};
        
        params.forEach(param => {
            result[param] = object[param];
        });
    
        return result;
    }

    return {isNumber, extractObjectParams};
}