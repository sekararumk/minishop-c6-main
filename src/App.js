import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import jwtDecode from "jwt-decode"
import axios from "axios"
import Async from 'react-async'
import { useDispatch } from "react-redux"

import userSlice from './store/user'
import Layout from './Layout/Layout'
import Product from "./Page/Product"
import ProductDetail from "./Page/ProductDetail"
import ShoppingCart from "./Page/ShoppingCart"
import Register from "./Page/Register"
import Login from "./Page/Login"
import Logout from "./Page/Logout"
import ProtectedRoute from "./Component/HOC/ProtectedRoute"
import UnprotectedRoute from "./Component/HOC/UnprotectedRoute"

const getUser = async () => {
  try {
    const token = localStorage.getItem('minishopAccessToken')
    const userData = jwtDecode(token)
    const res = await axios.get(`http://localhost:4000/users/${userData.sub}`)
    return {
      user: res.data
    } 
  } catch {
    return {
      user: null
    }
  }
}

function App() {

  const dispatch = useDispatch()

  return (
    <Async promiseFn={getUser}>
      {( {data, error, isPending} ) => {
        if(isPending) {
          return (
            <h2>Loading...</h2>
          )
        }
        if(error) {
          return (
            <h2>Error</h2>
          )
        }
        if(data){
          if ( data.user !== null ){
            dispatch(userSlice.actions.addUser( {userData: data.user} ))
          }
          return (
            <BrowserRouter>
              <div className="App">
                <Routes>
                  <Route path="/" element={<Layout />}>
                    { /* ALL */ }
                    <Route index element={<h1>Home</h1>} />
                    <Route path="products/">
                      <Route index element={<Product />} />
                      <Route path=":id" element={<ProductDetail />} />
                    </Route> 
                    <Route path="categories" element={<h1>Categories</h1>} />
                    <Route path="shopping-cart" element={<ShoppingCart />} />
                    <Route path="logout" element={<Logout />} />

                    { /* PUBLIC ONLY */ }
                    <Route path="/" element={<UnprotectedRoute />}>
                      <Route path="register" element={<Register />} />
                      <Route path="login" element={<Login />} />
                    </Route>

                    { /* PROTECTED */ }
                    <Route path="/" element={<ProtectedRoute />} >
                      <Route path="order-history" element={<h1>Order History</h1>} />
                    </Route>
                    
                  </Route>
                </Routes>
              </div>
            </BrowserRouter>
          );
        }
      }}
      </Async >
  );
}

export default App;
