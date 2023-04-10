import React, { useState } from 'react'
import { Axios } from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';



function LoginPage(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const OnEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }
    const OnPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    const onSubmitHandler = (event) => {
        event.preventDefault(); // prevent refresh
        console.log('Email', Email)
        console.log('Password', Password)

        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    {navigate('/')}
                } else {
                    alert('Error')
                }
            })
    }


  return (
    <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center'
        , width: '100%', height: '100vh'
    }}>
        <form style={{display: 'flex', flexDirection: 'column'}}
            onSubmit={onSubmitHandler}>
            <label>Email</label>
            <input type="email" value={Email} onChange={OnEmailHandler} />
            <label>Password</label>
            <input type="password" value={Password} onChange={OnPasswordHandler} />

            <br />
            <button type="submit">
                Login
            </button>
        </form>
    </div>
  )
}

export default LoginPage