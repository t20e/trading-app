import React, { useState, useEffect, useRef } from 'react'
import lighting from '../../imgs/lighting-08.svg'
import '../../styles/landingPage.css'
import { useNavigate } from "react-router-dom";
import Login from './Login';
import Reg from './Reg'
import btnClickAudio from '../../miscellaneous/btnClickAudio.mp3'
import axios from 'axios';

const Landing_page = () => {
    const logoRef = useRef(null)
    const btnRef = useRef(null)
    const loginRef = useRef(null)
    const regRef = useRef(null)
    const mainDisplayRef = useRef(null)
    const brandNameRef = useRef(null)
    const navigate = useNavigate()
    const [formErrors, setFormErrors] = useState({
        // 'loginFail': {
        //     msg: 'login credentials not valid'
        // }
    })
    const audio = new Audio(btnClickAudio)

    useEffect(() => {
        setTimeout(() => {
            btnRef.current.style.display = 'flex'
            brandNameRef.current.style.display = 'block'
        }, 1500)
    }, []);

    const submitForm = (data, url) => {
        // TODO
        console.log(data)
        axios.post(`http://localhost:8000/${url}`, data, { withCredentials: true })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const changeLayout = (path) => {
        audio.play()
        setFormErrors({})
        switch (path) {
            case 'main':
                mainDisplayRef.current.style.display = 'block'
                loginRef.current.style.display = 'none'
                regRef.current.style.display = 'none'
                break
            case 'login':
                mainDisplayRef.current.style.display = 'none'
                loginRef.current.style.display = 'flex'
                regRef.current.style.display = 'none'
                break
            case 'reg':
                mainDisplayRef.current.style.display = 'none'
                loginRef.current.style.display = 'none'
                regRef.current.style.display = 'flex'
                break;
            default:
                break;
        }
    }
    return (
        <div>
            <iframe id='spline' src='https://my.spline.design/untitled-f892a411b78db7f9806304d89c2ae295/' frameborder='0' width='100%' height='100%'></iframe>
            <div ref={mainDisplayRef} id='landingPage__cont'>
                <div className='landingPage__logoCont'>
                    <h1 ref={brandNameRef} className='landingPage__brandName'>Chord</h1>
                    <img ref={logoRef} id='landingPage__logo' src={lighting} alt="" />
                </div>
                <div ref={btnRef} className='landing_page_btns'>
                    <button onClick={() => changeLayout('reg')}>Register</button>
                    <p>or</p>
                    <button onClick={() => changeLayout('login')}>Login</button>
                </div>
                {/* <p>why you should bank with us?</p> */}
            </div>
            <div ref={loginRef} className='login'>
                <Login changeLayout={changeLayout} formErrors={formErrors} submitForm={submitForm} />
            </div>
            <div ref={regRef} className='reg'>
                <Reg changeLayout={changeLayout} formErrors={formErrors} submitForm={submitForm} />
            </div>
        </div>
    )
}

export default Landing_page