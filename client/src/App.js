import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.js'
import Auth from './components/Auth.js'
import Profile from './components/Profile.js'
import Public from './components/Public.js'
import ProtectedRoute from './components/ProtectedRoute.js'
import './css/styles.css'
import { UserContext } from './context/UserContext.js'

export default function App(){
  const { token, logout, userState, user } = useContext(UserContext)
  return (
    <div className="app">

        { token && <Navbar logout={logout} /> }
  
      <Routes>
        <Route 
          exact path="/" 
          element={token ? <Navigate to="/profile"/> : <Auth />}
        />
        <Route 
          path="/profile"
          element={<ProtectedRoute token={token} redirectTo="/">
            <Profile />
          </ProtectedRoute>}
        />
        <Route 
          path="/public"
          element={<ProtectedRoute token={token} redirectTo="">
            <Public />
            </ProtectedRoute >}
        />
      </Routes>
    </div>
  )
}