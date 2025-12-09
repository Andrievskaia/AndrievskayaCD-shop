const { Schema, model } = require('mongoose')

const User = new Schema({
    login: {
        type: String,
        uniqued: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
})

module.exports = model('User', User)