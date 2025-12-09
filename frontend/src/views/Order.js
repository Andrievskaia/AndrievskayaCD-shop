import React from "react";
import {formatDate} from '../functions.js';

function Order(props) {
  const date = formatDate(props.date);
    return (
        <div className="Order">
            <div className='item date'>{ date }</div>
            <div className='item status'>{ props.status }</div>
        </div>
    );
}

export default Order;