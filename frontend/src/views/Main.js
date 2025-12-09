import React, {useState, useEffect}  from 'react';
import './Main.css';
import Product from '../components/Product';

function Main() {

  const[products, setProducts] = useState([])

  useEffect(() => {

    const api = 'http://localhost:9001/products'

    fetch(api)
    .then(result => result.json())
    .then((result) => {
      console.log(result)
      setProducts(result.data)
    })

  }, [])

  return (
    <div className="Main">
      <h1>Товары</h1>
      <div className='Item-M'>
        { products.map((item) => <Product key={item._id} id={item._id} title={item.title} image={item.image} price={item.price}/>)}
      </div>
    </div>
  );
}

export default Main;