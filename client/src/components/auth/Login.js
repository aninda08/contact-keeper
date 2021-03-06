import React, { useState, useEffect, useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';

const Login = props => {
    const {setAlert} = useContext(AlertContext);
    const {login, error, clearErrors, isAuthenticated } = useContext(AuthContext);

    const [ user, setUser ] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if(isAuthenticated) {
            props.history.push('/');
        }
        
        if(error !== undefined && error !== null)
        {
            setAlert('Invalid Credentials', 'danger');
            clearErrors();
        }
    }, [error, isAuthenticated, props.history]);

    const { email, password } = user;

    const onChange = e => setUser({ ...user, [e.target.name]:e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if(email === '' || password === '') {
            setAlert('Please fill in all the fields', 'danger');
        } else {
            login({
                email,
                password
            });
        }
    }

    return (
        <div className="form-container">
            <h1>
                Account <span className='text-primary'>Login</span>
            </h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">password</label>
                    <input type="password" name="password" value={password} onChange={onChange} required />
                </div>
                <input type="submit" value="Login" className="btn btn-primary btn-block" />
            </form>
        </div>
    )
}

export default Login;
