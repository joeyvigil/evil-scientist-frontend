import { Button, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router';


const Login = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Perform login logic here (e.g., authentication)
        // On successful login, navigate to the dashboard
        navigate('/dashboard');
    }

  return (
    <Container>
        <h2>Evil Scientist Corp. Login</h2>

        <div>
            <Form.Control 
                type='password' 
                placeholder='Enter your password'
                name='password' 
            />

        <button onClick={handleLogin} className='btn btn-danger'>Login</button>

        </div>
    </Container>
  )
}

export default Login