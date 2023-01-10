import React, { useState, useEffect, useRef } from 'react'
import styles from '../../styles/regLogin.css'
import { err_exclamationPoint } from '../../miscellaneous/svgIcons'


// TODO make it check if theres a email address with that email as user types it in
const inputsInOrder = ['firstName', 'lastName', 'age_pfp', 'email', 'password', 'confirmPassword']
const onlyLettersRegex = new RegExp(/^[A-Za-z]+$/)
const imgRegex = new RegExp("[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$")
const emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)


const Reg = ({ submitForm, changeLayout, vibrateErr, changeErrVibrate }) => {
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        age: "",
        profilePic: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [currInput, setCurrInput] = useState('firstName')
    const [renderImg, setRenderimg] = useState('')
    const [renderImgErr, setRenderImgErr] = useState(null)
    const [formErrors, setFormErrors] = useState({})

    const regUser = (e) => {
        e.preventDefault()
        if (Object.keys(formErrors).length > 0) {
            changeErrVibrate()
            return
        } else if (inputsInOrder.indexOf(currInput) !== inputsInOrder.length - 1) {
            setCurrInput(inputsInOrder[inputsInOrder.indexOf(currInput) + 1])
            return;
        }
        console.log('all input entered')
        const formData = new FormData()
        formData.append("first_name", newUser.firstName);
        formData.append("last_name", newUser.lastName);
        formData.append("age", newUser.age);
        formData.append("email", newUser.email);
        formData.append("password", newUser.password);
        formData.append("confirmPassword", newUser.confirmPassword);
        formData.append("pfp", newUser.profilePic);
        submitForm(formData, 'api/users/register/')
    }

    const goBackInput = (e) => {
        e.preventDefault();
        setCurrInput(inputsInOrder[inputsInOrder.indexOf(currInput) - 1])
    }
    const checkTextInput = (e) => {
        let name = e.target.name
        name = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
        let obj = {}
        obj[name] = ''
        // console.log(onlyLettersRegex.test(newUser[e.target.name]))
        if (
            e.target.value.length < 2 ||
            e.target.value.length > 32 ||
            e.target.value.length === 0
        ) {
            obj[e.target.name] = `${name} must be between 3 and 32 characters`
            setFormErrors(obj)
        } else if (!onlyLettersRegex.test(e.target.value)) {
            obj[e.target.name] = `${name} must only contain letters`
            setFormErrors(obj)
        }
        else {
            setFormErrors({})
        }
    }
    const editInputs = (e) => {
        switch (e.target.name) {
            case 'firstName':
                checkTextInput(e)
                break;
            case 'lastName':
                checkTextInput(e)
                break;
            case 'age':
                if (Number(e.target.value) < 18 || Number(e.target.value) > 150 || e.target.value.length === 0) {
                    setFormErrors({ 'age_pfp': 'age must be between 18 and 150' })
                } else {
                    setFormErrors({})
                }
                break
            case 'email':
                if ((!emailRegex.test(e.target.value))) {
                    setFormErrors({ 'email': 'please enter a valid email address' })
                } else {
                    setFormErrors({})
                }
                break
            case 'password':
                if (newUser.password.length < 8) {
                    setFormErrors({ 'password': 'password must be longer than 8 characters' })
                } else {
                    setFormErrors({})
                }
                break;
            case 'confirmPassword':
                if (e.target.value.length < 8) {
                    setFormErrors({ 'confirmPassword': 'confirm password must be longer than 8 characters' })
                } else if (e.target.value !== newUser.password) {
                    setFormErrors({ 'confirmPassword': "confirm password doesn't match password" })
                } else {
                    setFormErrors({})
                }
                break;
            default:
                break;
        }
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value
        })
    }
    const showPfp = (e) => {
        if (!imgRegex.test(e.target.value)) {
            console.log('not a valid image')
            setRenderImgErr('only jpegs, jpg, png images allowed!')
            setRenderimg('')
            setNewUser({
                ...newUser,
                profilePic: ''
            })
        } else {
            setNewUser({
                ...newUser,
                profilePic: e.target.files[0]
            })
            setRenderImgErr(null)
            let img = URL.createObjectURL(e.target.files[0])
            setRenderimg(img)
        }
        // console.log(newUser.profilePic, renderImg);
    }
    return (
        <div className='regCont' >
            <form onSubmit={regUser}>
                {currInput === 'firstName' ?
                    <input className='currInput' type="text" placeholder='first name' name='firstName'
                        onChange={(e) => editInputs(e)}
                        value={newUser.firstName}
                    />
                    : ''}
                {/* {getError('firstName')} */}
                {currInput === 'lastName' ?
                    <input autoFocus type="text" name='lastName' placeholder='last name' onChange={(e) => editInputs(e)}
                        className='currInput'
                        value={newUser.lastName}
                    />
                    : ''}

                {currInput === 'age_pfp' ?
                    <div className='currInput'>
                        {renderImg !== '' ?
                            <img src={renderImg} alt="pfp img" id='showPfp' />
                            : ''
                        }
                        <label className='pfpLabel'> upload optional profile picture
                            <input type="file" className='fileInput' accept="image/*" name="profilePic" onChange={(e) => (showPfp(e))} />
                        </label>
                        {
                            renderImgErr !== null ?
                                <p className='imgValP'>{renderImgErr}</p>
                                :
                                null
                        }
                        <input autoFocus type="number" className='reg__age_input' name='age' placeholder='age' onChange={(e) => editInputs(e)} value={newUser.age} />
                    </div>
                    : ''}

                {currInput === 'email' ?
                    <input autoFocus type="text" name='email' placeholder='email' onChange={(e) => editInputs(e)}
                        className='currInput'
                        value={newUser.email} />
                    : ''}
                {currInput === 'password' ?
                    <input autoFocus type="password" name='password' placeholder='password' onChange={(e) => editInputs(e)}
                        className='currInput'
                        value={newUser.password}
                    />
                    : ''}
                {currInput === 'confirmPassword' ?
                    <input autoFocus type="password" name='confirmPassword' placeholder='confirm password' onChange={(e) => editInputs(e)}
                        className='currInput'
                        value={newUser.confirmPassword}
                    />
                    : ''}
                {formErrors[currInput] ?
                    <div className={`reg__err ${vibrateErr}`}>
                        <p >{formErrors[currInput]}</p>
                        {/* <img src="https://portfolio-avis-s3.s3.amazonaws.com/app/icons/err_exclamationPoint.svg" alt="" /> */}
                        {err_exclamationPoint}
                    </div>
                    : null}
                <button type="submit" style={{ display: 'none' }}></button>
            </form>
            <div className='regPage__btns'>
                {currInput !== 'firstName' ?
                    <button className='goBackBtn' onClick={goBackInput}>go back?</button>
                    : ''}
                <button className='goBackBtn' onClick={(e) => changeLayout('main', e)}>go to start?</button>
            </div>
            {newUser.firstName !== "" ?
                <p className='footerP'>*press <b>enter</b> to continue</p>
                : null}
        </div>
    )
}

export default Reg