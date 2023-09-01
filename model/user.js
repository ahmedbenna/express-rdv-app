const Joi = require('joi');

let userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))().min(8).max(30).required(),
    role: Joi.string().valid('doctor', 'secretary').required(),
});

function validateUser(obj, res) {
    let valid_res = userSchema.validate(obj);
    if (valid_res.error)
        return res.status(400).send(valid_res.error.message);
}

module.exports.validateUser = validateUser;
