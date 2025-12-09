import React, { useState, useEffect } from "react";
import "./Orders.css";
import Order from "./Order.js";
import { getOrders } from "../functions.js"


function Orders(props) {
    const [orders, setOrders] = useState([]);
    console.log('bhj');
    useEffect(() => {
        getOrders(setOrders);
    }, []);

    return (

        <div className="Orders">
            <h2>Заказы</h2>
            <div className="list-orders">
                <div className="title">
                    <div className="item">Дата заказа</div>
                    <div className="item">Статус</div>
                </div>
                {orders.length ? (
                    orders.map(item => (
                        <Order
                            key={item._id}
                            date={item.createdAt}
                            status={item.status}
                        />
                    ))
                ) : (
                    <div className='no-entity'>Заказов нет</div>
                )}
            </div>
        </div>
    );
}

export default Orders;