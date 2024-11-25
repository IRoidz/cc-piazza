const joi = require('joi')

const registerValidation = (data) =>{
    const schemaValidation = joi.object({
        username: joi.string().required().min(2).max(40),
        email: joi.string().required().min(6).max(256).email(),
        password: joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) =>{
    const schemaValidation = joi.object({
        email: joi.string().required().min(6).max(256).email(),
        password: joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const postValidation = (data) =>{
    const schemaValidation = joi.object({
        title: joi.string().required().min(1).max(1000),
        topic: joi
        .array()
        .items(joi.string().valid('Politics', 'Health', 'Sport', 'Tech'))
        .required(),
        body: joi.string().required().max(3000),
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postValidation = postValidation