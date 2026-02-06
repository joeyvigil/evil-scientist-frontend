import React from 'react'
import { Card, Form } from 'react-bootstrap'
import axios from 'axios';

const Chat = () => {
    const [message, setMessage] = React.useState('');
    const [responses, setResponses] = React.useState<string[]>([]);
    const [sending, setSending] = React.useState("Send");

    const handleSend = async () => {
        setSending("Awaiting Response...");
        document.getElementById('button1')!.disabled = true;

        const response = await axios.post("http://127.0.0.1:8000/chat/memory-chat", {input:message})
        const data = response.data;
        console.log(data);

        setResponses([...responses, `You: ${message}`, `Bot: ${data.response}`]);
        setMessage('');

        setSending("Send");
        document.getElementById('button1')!.disabled = false;
    }

  return (
    <Card className='chat'>
        <Card.Body>
            <Card.Title>Evil Chat</Card.Title>

            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Control as="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
            </Form.Group>
            <button className='btn btn-primary' onClick={handleSend} id='button1'>{sending}</button>

            <Card.Title className='mt-4'>Chat History:</Card.Title>
            <div className='responses'>
                {responses.map((response, index) => (
                    <p key={index}>{response}</p>
                ))}
            </div>
        </Card.Body>
    </Card>
  )
}

export default Chat