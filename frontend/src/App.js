import React,{useState} from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './views/Main';
import Cart from './views/Cart';
import Orders from './views/Orders';
import ModalBox from './components/ModalBox';
import Login from './components/Login';
import Registration from './components/Registration';
import Profile from './components/Profile';

function App() {

  const[page, setPage] = useState('Main')
  const[modalBox, setModalBox] = useState('none')

  const pages = {
    Main: <Main />,
    Cart: <Cart/>,
    Orders: <Orders/>
  }
  const modalBoxes = {
    none: null,
    Login: <ModalBox setModalBox={setModalBox}><Login setModalBox={setModalBox}/></ModalBox>,
    Registration: <ModalBox setModalBox={setModalBox}><Registration setModalBox={setModalBox}/></ModalBox>,
    Profile: <ModalBox setModalBox={setModalBox}><Profile setModalBox={setModalBox}/></ModalBox>
  }

  return (
    <div className="App">
      <Header setPage={ setPage } setModalBox={setModalBox} />
      { pages[page] }
      { modalBoxes[modalBox] }
      <Footer />
    </div>
  );
}

export default App;
