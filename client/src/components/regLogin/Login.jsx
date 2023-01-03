import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/regLogin.css'

const Login = ({ submitForm, changeLayout, formErrors }) => {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    const loginUser = (e) => {
        e.preventDefault()
        // TODO
        let formInfo = { email, password };
        submitForm(formInfo, "api/users/login")
    }

    return (
        <div id='loginCont'>
            <form onSubmit={loginUser}>
                <input type="text" placeholder='email' name='email' autoFocus onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                {/* {
                    formErrors.hasOwnProperty('loginFail') ?
                        <div className='formErr'>
                            {formErrors['loginFail'].msg}
                            hi
                        </div>
                        : null
                } */}
                <button className='goBackBtn' onClick={() => changeLayout('main')}>go back?</button>
                <input type="submit" className={styles.submitBtn} value="Login" />
            </form>
        </div>
    )
}

export default Login