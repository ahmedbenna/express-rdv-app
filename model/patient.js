const Joi = require('joi');

const d = new Date();
d.setFullYear(d.getFullYear() - 18);

let patientSchema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    birthday: Joi.date().max(d),
    cin: Joi.string().length(8).required(),
    phone: Joi.number().min(10000000).max(99999999).required(),
    description: Joi.string()
});

function validatePatient(obj, res) {
    let valid_res = patientSchema.validate(obj);
    if (valid_res.error)
        return res.status(400).send(valid_res.error.message);
}

module.exports.validatePatient = validatePatient;
