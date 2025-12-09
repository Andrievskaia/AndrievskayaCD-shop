import React from 'react';
import './Product.css';
import {addProductCart} from '../functions.js'

function Product({id, title, image, price}) {
  return (
    <div className="Product">
      <img src={`images/${image}`} alt={title}/>
      <h1>{title}</h1>
      <p>{`${price} руб`}</p>
      <button onClick={() => {addProductCart(id)}}>В корзину</button>
    </div>
  );
}

export default Product;