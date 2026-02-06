import { useEffect, useRef, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router';
import { store } from '../GlobalData/store';



const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {

    }, []);

    const handleLogin = () => {
        if (username === 'admin' && password === 'password') {
            store.setLoggedInUser({
                id: 1,
                username: 'admin',
                email: 'admin@example.com',
                role: 'admin'
            });
            navigate('/dashboard');
        } else {
            alert('Invalid credentials. Please try again.');
        }
    }

  return (
    <Container>
        <h2>Evil Scientist Corp. Login</h2>

        <div>
            <Form.Control 
                type='text' 
                placeholder='Enter your username'
                name='username' 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Control 
                type='password' 
                placeholder='Enter your password'
                name='password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

        <button onClick={handleLogin} className='btn btn-danger'>Login</button>

        </div>
    </Container>
  )
}

export default Login