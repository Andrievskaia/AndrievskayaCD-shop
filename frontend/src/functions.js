import Cookie from "js-cookie"


const apiUrl = 'http://localhost:9001';

export const addProductCart = (productId) => {
    console.log(productId);
    if (productId) {
        //
        const token = getToken();
        if (token === undefined)
            return;
        //
        const data = {
            productId: productId,
            productCount: 1
        };
        console.log("asd");
        fetch(`${apiUrl}/cart_add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify(data)
        }).then(result => result.json()).then(result => {
            console.log(result);
            alert(result.message);
        });
    }
};

// Получает список товаров для корзины по логину
export const getListCart = (setCartProducts, setTotalPrice) => {
    const token = getToken();
    if (token === undefined)
        return;
    fetch(`${apiUrl}/cart`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `${token}`
        }
    })
        .then(result => result.json())
        .then(result => {
            const cartProducts = result.data;
            const totalPrice = cartProducts.reduce((prev, item) => {
                return prev + item.price;
            }, 0);
            setCartProducts(cartProducts);
            setTotalPrice(totalPrice);
        });
};

// Удаляет товар из корзины
export const cartProductDelete = (productId, setCartProducts, setTotalPrice, setCountCart) => {
    if (productId) {
        const token = getToken();
        if (token === undefined)
            return;
        const data = {
            productId: productId
        };
        fetch(`${apiUrl}/cart_delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify(data)
        }).then(result => result.json()).then(result => {
            if (result.status === 'ok') {
                getListCart(setCartProducts, setTotalPrice, setCountCart);
            } else {
                alert(result.message);
            }
        });
    }
};

// Получает кол-во товаров в корзине
export const getCountProductsCart = (setCountCart) => {
    console.log("getCountProductsCart");
    const token = getToken();
    if (token === undefined)
        return;
    fetch(`${apiUrl}/cart_count`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `${token}`
        }
    })
        .then(result => result.json())
        .then(result => {
            setCountCart(result.count);
        });
};
export const addOrder = () => {
    const CartItem = document.querySelectorAll('.CartItem');
    if (CartItem) {
        const token = getToken();
        if (token === undefined)
            return;
        fetch(`${apiUrl}/order_add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
        })
            .then(result => result.json())
            .then(result => {
                alert(result.message);
                window.location.reload(true);
            });
    }
};

// Получает куки об авторизации
export const getLogin = () => {
    return Cookie.get('login');
};

export const getToken = () => {
    return Cookie.get('token');
};

export const getOrders = (setOrders) => {
    const token = getToken();
    console.log(token);
    if (token === undefined) return;
    fetch(`${apiUrl}/orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `${token}`
        }
    }).then(resurlt => resurlt.json()).then(resurlt => {
        const orders = resurlt.data;
        console.log(orders);
        setOrders(orders);
    });
};

export const formatDate = (dateString) => {
    //const dateString = "2025-06-21T14:55:14.956Z";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
};