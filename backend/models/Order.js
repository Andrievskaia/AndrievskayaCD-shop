const {Schema, model} = require('mongoose')

const orderhema = new Schema({
    login: {
        type: String,
        require: true
    },
    productIds: {
        type: Array,
        require: true
    },
    totalPrice: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Date,
        require: true
    },
    status: {
        type: String,
        require: true,
        default: 'Оформлен'
    }
})

const Order = model('Order', orderhema);

module.exports = Order