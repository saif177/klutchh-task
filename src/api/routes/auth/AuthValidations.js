const { Joi, common } = require('../../util/validations');

const logIn = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().optional().allow(),
});

module.exports = {
    logIn
};
