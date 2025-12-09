import React from "react";
import "./Cart.css"
import {cartProductDelete} from "../functions.js";

function CartItem(props) {
    const setCartProducts = props.setCartProducts,
        setTotalPrice = props.setTotalPrice,
        setCountCart = props.setCountCart;
    return (
        <div className="CartItem">
            <div className="image"><img alt={props.title} src={`images/${props.image}`}/></div>
            <div className="Title">{props.title}</div>
            <div className="Price" data-price={props.price}>{props.price} руб.</div>
            <button onClick={() => {cartProductDelete(props.id, setCartProducts, setTotalPrice, setCountCart)}}>Удалить</button>
        </div>    
);
}

export default CartItem;