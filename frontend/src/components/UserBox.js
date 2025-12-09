import React from 'react';
import Cookie from 'js-cookie'
import './UserBox.css';

function UserBox({setModalBox}) {
  const token = Cookie.get('token');
  const login = Cookie.get('login');
  if (token === undefined) {
    return (
      <div className="UserBox">
        <button onClick={() => setModalBox('Login')}> Вход</button> 
        <button onClick={() => setModalBox('Registration')}>Регистрация</button> 
      </div>
    );
  } else {
    return (
      <div className='Profile'>
        <button onClick={() => (setModalBox('Profile'))}>{login}</button>
      </div>
    );
  }
}

export default UserBox;