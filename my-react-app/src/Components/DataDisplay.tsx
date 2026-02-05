import React from 'react'
import { Card, Button } from 'react-bootstrap';


const DataDisplay: React.FC<{ user: any }> = ({ user }) => {
  return (
    <Card style={{ width: '18rem' }} className='m-3'>
      <Card.Img variant="top" src="https://picsum.photos/100/60" />
      <Card.Body>
        <Card.Title>{user.username}</Card.Title>
        <Card.Text>
          Hello, my name is {user.username}, my email is {user.email}, and my password is {user.password}.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}

export default DataDisplay