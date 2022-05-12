import React from 'react'
import { useDispatch } from 'react-redux'
import userSlice from '../store/user'
import { Navigate } from 'react-router-dom'

const Logout = () => {

    const dispatch = useDispatch()

    // menghapus token dari local storage
    localStorage.removeItem('minishopAccessToken')
    // mengupdate user store menjadi null
    dispatch( userSlice.actions.removeUser() )

    return (
        <Navigate to="/login" />
    )
}

export default Logout