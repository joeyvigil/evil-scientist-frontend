import { useEffect, useRef } from 'react';
import { Button, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router';


const Login = () => {
    const navigate = useNavigate();
    
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    }, []);

    const handleLogin = () => {
        navigate('/dashboard');
    }

  return (
    <Container>
        <h2>Evil Scientist Corp. Login</h2>

        <div>
            <Form.Control 
                type='text' 
                placeholder='Enter your username'
                name='username' 
                ref={usernameRef}
            />
            <Form.Control 
                type='password' 
                placeholder='Enter your password'
                name='password' 
                ref={passwordRef}
            />

        <button onClick={handleLogin} className='btn btn-danger'>Login</button>

        </div>
    </Container>
  )
}

export default Login