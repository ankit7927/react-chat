import { createSlice } from '@reduxjs/toolkit'
import { signin, signup } from './authReducer'

const initialState = {
    authenticated: false,
    userId: null,
    error: null,
    status: 'idle',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.authenticated = false
            state.error = null
            state.userId = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(signin.pending, (state) => {
                state.status = 'loading'
            })

            .addCase(signin.rejected, (state, action) => {
                state.status = 'idle'
                state.error = action.error.message
            })

            .addCase(signin.fulfilled, (state, action) => {
                state.status = 'idle'
                state.userId = action.payload.data._id
                state.authenticated = true
            })

            .addCase(signup.pending, (state) => {
                state.status = 'loading'
            })

            .addCase(signup.rejected, (state, action) => {
                state.status = 'idle'
                state.error = action.error.message
            })

            .addCase(signup.fulfilled, (state, action) => {
                state.status = 'idle'
                state.userId = action.payload.data._id
                state.authenticated = true
            })

    }
})

export const { logout } = authSlice.actions
export default authSlice.reducer