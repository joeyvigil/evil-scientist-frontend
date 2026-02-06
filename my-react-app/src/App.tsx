// import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './Components/Login.tsx'
import Dashboard from './Components/Dashboard.tsx'

//npm install react-bootstrap bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Chat from './Components/Chat.tsx'



function App() {
  

  return (
    <>
      <h1>App.tsx page</h1>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>


    </>
  )
}

export default App
