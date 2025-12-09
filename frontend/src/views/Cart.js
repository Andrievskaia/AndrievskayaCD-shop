import React, { useState, useEffect } from "react";
import "./Cart.css";
import CartItem from "./CartItem.js";
import { getListCart, addOrder } from '../functions.js';

function Cart(props) {
    const [cartProducts, setCartProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        getListCart(setCartProducts, setTotalPrice);
    }, []);

    return (
        <div className="Cart">
            <h1>Корзина</h1>
            <div className="Cart-content">
                <div className="left">
                    <div className="Items">
                        {cartProducts.length ? (
                            cartProducts.map(item => (
                                <CartItem
                                    key={item._id}
                                    id={item._id}
                                    cartItemId={item._id}
                                    image={item.image}
                                    title={item.title}
                                    price={item.price}
                                    setCartProducts={setCartProducts}
                                    setTotalPrice={setTotalPrice}
                                />
                            ))
                        ) : (
                            <div className='no-entity'>Корзина пустая</div>
                        )}
                    </div>
                </div>
                <div className="right">
                    <div className="Total">
                        <div className="Sub-title">Информация о заказе</div>
                        <div className="row">
                            <div className="row-title">Всего товаров: </div>
                            <div className="row-value">{cartProducts.length} позиций</div>
                        </div>
                        <div className="row">
                            <div className="row-title">Всего сумма: </div>
                            <div id="total" className="row-value" data-total={totalPrice}>{totalPrice} руб.</div>
                        </div>
                    </div>
                    <button onClick={() => addOrder()}>Оформить заказ</button>
                </div>
            </div>

        </div>
    );
}
export default Cart;