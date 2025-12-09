import React, { useState, useEffect } from 'react'
import Cookie from 'js-cookie'

function Profile({ setModalBox }) {
    const [login, setLogin] = useState("login")
    const [email, setEmail] = useState("email")
    const token = Cookie.get('token');

    function logout() {
        Cookie.remove('token');
        setModalBox('none');
    }

    function redact() {
        const api = 'http://localhost:9001/me';
        const email = document.getElementById('email').value;
        const password_new = document.getElementById('password_new').value;
        const password_old = document.getElementById('password_old').value;
        const data = {
            email: email,
            password_new: password_new,
            password_old: password_old
        };
        fetch(api, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify(data)
        }).then(result => result.json()).then(result => {
            if (!result.result) {
                alert(result.message);
            } else if (result.result) {
                alert(result.message);
                setModalBox("none");
            }
        });
    }


    useEffect(() => {
        const api = 'http://localhost:9001/me';
        const token = Cookie.get('token');
        fetch(api, {
            headers: {
                'authorization': `${token}`
            }
        }).then(result => result.json()).then(result => {
            // console.log(result)
            setEmail(result.email);
            setLogin(result.login);
        });
    }, []);

    return (
    <>
        <div className="ModalBox">
            <h1>Аккаунт {login}</h1>
            <p>Почта: {email}</p>
            <h2>Редактировать данные профиля:</h2>
            <input id="email" placeholder="Почта" type="email"/>
            <input id="password_old" placeholder="Старый пароль" type="password"/>
            <input id="password_new" placeholder="Пароль" type="password"/>
            <div className="Butt"> 
                <button className="Red" onClick={redact}>Сохранить</button>
                <button className="LogOut" onClick={logout}>Выйти</button>
            </div>
        </div>
    </>
    );
}

export default Profile;