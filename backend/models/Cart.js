const {Schema, model} = require('mongoose')

const cartSchema = new Schema({
    login: {
        type: String,
        require: true
    },
    productId: {
        type: String,
        require: true
    },
    productCount: {
        type: Number,
        require: true
    }
})

const Cart = model('Cart', cartSchema);

module.exports = Cart