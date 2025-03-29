import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './Components/Login'
import Users from './Components/Users'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/users' element={<Users/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
