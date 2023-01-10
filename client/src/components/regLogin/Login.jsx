import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/regLogin.css'
import { err_exclamationPoint } from '../../miscellaneous/svgIcons'

const Login = ({ submitForm, changeLayout, formErrors, vibrateErr, changeErrVibrate }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginUser = (e) => {
        e.preventDefault()
        // TODO
        const formInfo = new FormData()
        formInfo.append("email", email);
        formInfo.append("password", password);
        submitForm(formInfo, "api/users/login/")
    }

    return (
        <div id='loginCont'>
            <form onSubmit={loginUser}>
                <input type="text" placeholder='email' name='email' autoFocus onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                {formErrors['loginFail'] ?
                    <div className={`reg__err ${vibrateErr}`}>
                        <p >{formErrors['loginFail']}</p>
                        {/* <img src="https://portfolio-avis-s3.s3.amazonaws.com/app/icons/err_exclamationPoint.svg" alt="" /> */}
                        {err_exclamationPoint}
                    </div>
                    : null}
                <input type="submit" className={styles.submitBtn} value="Login" />
            </form>
            <button className='goBackBtn' onClick={(e) => changeLayout('main', e)}>go back?</button>
        </div>
    )
}

export default Login