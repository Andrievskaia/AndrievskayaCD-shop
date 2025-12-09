const PORT = 9001
const URLDB = 'mongodb://127.0.0.1:27017'

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {secret} = require('./config')
const User = require('./models/User')
const Product = require('./models/Product')
const Cart = require('./models/Cart')
const Order = require('./models/Order')

// Настраиваем сервер
const app = express()

app.use(cors())
app.use(express.json())

const generateAccessToken = (id) => {
    const payload = {
        id
    }
    console.log(id)
    // jwt.verify()
    return jwt.sign(payload, secret, {expiresIn: '24h'})

}

const verifyAccessToken = (token) => {

    try {
        const payload = jwt.verify(token, secret)
        //нужно проверить время жизни токена
        //console.log(payload)
        return payload.id
    }
    catch (JsonWebTokenError) {
        return false
    }

}

// Регистрация нового пользователя
app.post('/registration', async (req, res) => {
    const{login, password, email} = req.body
    if ((password.length  < 4) || email.length  < 4 || login.length < 4){
        return res.json({message: 'слишком короткий'})
    } else if ((await User.find({login: login})).length > 0){
        return res.json({message: 'логин занят'})
    }
    const user = new User({login, password, email})
    await user.save()
    res.json({
        message: 'Вы успешно зарегистрировались!'
    })
})

// Авторизация в ЛК
app.post('/login', async (req, res) => {
    console.log(req.body)
    const{login, password} = req.body
    const user = await User.findOne({login})
    if (!user){
        return res.status(400).json({message: 'Пользователь не найден!'})
    }
    if (user.password !== password){
        return res.status(400).json({message: 'Неверный логин или пароль!'})
    }
    const token = generateAccessToken(user._id)
    res.json({
        message: 'Вы успешно авторизованы!',
        token: token,
        expiresIn: 1
    })
})

//Получение данных о "Я"
app.get('/me', async (req, res) => {
    const id = verifyAccessToken(req.headers.authorization)
    if (id === false)
        return res.status(401).json({
            message: "token out of date",
            result: false
        })
    const user = await User.findById(id)


    res.json({
        login: user.login,
        email: user.email
    })
})

app.put('/me', async (req, res) => {
    const id = verifyAccessToken(req.headers.authorization)
    if (id === false)
        return res.status(401).json({
            message: "token out of date",
            result: false
        })
    const user = await User.findById(id)

    const {email, password_new, password_old} = req.body
    
    if (password_old != user.password){
        return res.json({
            message: "Пароль не верный!",
            result: false,
        })
    }

    if (password_new.length > 4)
        user.password = password_new
    if (email.includes('@'))
        user.email = email
    user.save()
    return res.json({
        result: true,
        message: "Данные успешно изменены!"
    })
})


app.patch

//товары
app.get('/products', async (req, res) => {

    /*const products = [
        {id: 1, header: 'Товар 1', price: 120},
        {id: 2, header: 'Товар 2', price: 3600},
        {id: 3, header: 'Товар 3', price: 5600},
        {id: 4, header: 'Товар 4', price: 1000},
        {id: 5, header: 'Товар 5', price: 5999},
        {id: 6, header: 'Товар 6', price: 399},
        {id: 7, header: 'Товар 7', price: 6678},
        {id: 8, header: 'Товар 8', price: 545}
    ]*/

    const products = await Product.find()

    res.json({
        data: products
    })
}) 

// Добавление товара в корзину
app.post('/cart_add', async (req, res) => {
    const id = verifyAccessToken(req.headers.authorization)
    if (id === false)
        return res.status(401).json({
            message: "token out of date",
            result: false
        })
    const user = await User.findById(id)

    const login = user.login
    const {productId, productCount} = req.body
    console.log(productId, login)

    const cartItem = await Cart.find({login: login, productId: productId})

    let message = ''
    console.log(cartItem)
    if (!cartItem.length){
        const cartItem = new Cart({
            login: login,
            productId: productId,
            productCount: productCount,
        });

        await cartItem.save()
        message = 'Товар добавлен в корзину!'
    } else {
        cartItem.productCount += 1;
        // cartItem.save()
        message = 'Данный товар уже в корзине!'
    }

    res.json({
        status: 'ok',
        message: message
    })
})

// Выводит товары в корзину
app.get('/cart', async (req, res) => {
    const id = verifyAccessToken(req.headers.authorization)
    if (id === false)
        return res.status(401).json({
        message: "token out of date",
        result: false
        })
    const user = await User.findById(id)
    const login = user.login
    let data = {};
    let message;

    if (login){
        const cartData = await Cart.find({login: login})

        if (cartData){
            const productIds = cartData.map(item => item.productId)
            data = await Product.find({_id: {$in: productIds}})

            data.map((item, index) => {
                const cartId = cartData.find(element => element.productId == item._id)

                data[index].cartId = cartId._id
            })
        } else {
            message = 'Корзина пуста!'
        }
    }

    res.json({
        status: 'ok',
        data: data,
        message: message
    })
})

// Удаляет товар из корзины
app.post('/cart_delete', async (req, res) => {
    const id = verifyAccessToken(req.headers.authorization)
    if (id === false)
        return res.status(401).json({
        message: "token out of date",
        result: false
        })
    const user = await User.findById(id)

    const login = user.login
    const {productId} = req.body
    let cartData = false;

    if (productId && login){
        cartData = await Cart.deleteOne({$and: [{productId: productId, login: login}]})
    }

    res.json({
        status: (cartData) ? 'ok' : 'no',
        message: (cartData) ? 'Удалено!' : 'Не удалось удалить!'
    })
})

app.get('/cart_count', async (req, res) => {
    const id = verifyAccessToken(req.headers.authorization)
    if (id === false)
        return res.status(401).json({
        message: "token out of date",
        result: false
        })
    const user = await User.findById(id)

    const login = user.login
    
    let countItems = 0;
    if (login){
        countItems = await Cart.countDocuments({login: login})
    }
    res.json({
        status: 'ok',
        count: countItems
    })
})

// Оформление (добавление) заказа
app.post('/order_add', async (req, res) => {
    const id = verifyAccessToken(req.headers.authorization)
    if (id === false)
        return res.status(401).json({
        message: "token out of date",
        result: false
        })
    const user = await User.findById(id)

    const login = user.login
    productIds = []
    totalPrice = 0

    const cart = await Cart.find({login: login})
    for(i=0; i<cart.length; i++){
        productid = cart[i].productId
        productIds.push(productid)
        product = await Product.findById(productid)
        totalPrice += product.price * cart[i].productCount
    }
    const ordertem = new Order({
        login: login,
        productIds: productIds,
        totalPrice: totalPrice,
        createdAt: new Date()
    })
    await ordertem.save()
    await Cart.deleteMany({ login: login })

    res.json({
        status: 'ok',
        message: 'Заказ оформлен!'
    })
})

// Выводит список заказов
app.get('/orders', async (req, res) => {
    console.log("asd")
    const id = verifyAccessToken(req.headers.authorization)
    if (id === false)
        return res.status(401).json({
        message: "token out of date",
        result: false
        })
    const user = await User.findById(id)

    const login = user.login
    let data = {};
    let message;

    if (login){
        data = await Order.find({login: login})
    }

    res.json({
        status: 'ok',
        data: data,
        message: message
    })
})


const start = async () => {
    try{
        await mongoose.connect(URLDB, {authSource: "admin"})
        app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порте`))
    } catch (e) {
        console.log (e)
    }
}

start()