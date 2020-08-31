module.exports = app => {
    const existsOrError = (value, msg) => {
        if (!value) throw msg;
        if (Array.isArray(value) && value.length === 0) throw msg;
        if (typeof value === String && value === '') throw msg;
    }

    const notExistsOrError = (value, msg) => {
        try {
            existsOrError(value, msg);
        } catch {
            return;
        };

        throw msg;
    }

    const equalsOrError = (value1, value2, msg) => {
        if (value1 !== value2) throw msg;
    }

    const onlyNumbersOrError = (value, msg) => {
        if (!value) throw msg;
        if (!/^\d+$/.test(value)) throw msg;
    }

    return {existsOrError, notExistsOrError, equalsOrError, onlyNumbersOrError};
}