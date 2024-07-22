import {createSlice, configureStore} from '@reduxjs/toolkit'; 

const user = createSlice({
    name: "user", 
    initialState:{
        id: '', 
        pw: '',
        isLoging: false, 
    }, 
    reducers: {
        loginUser: (state, action)=>{
            state.id = action.payload.id; 
            state.pw = action.payload.pw; 
            state.isLoging = action.payload.isLoging; 
        }, 
        Userpw: (state, action)=>{
            state.pw = action.payload.pw;
        },
        clearUser: (state)=>{
            state.id = ''; 
            state.pw = ''; 
            state.isLoging = false;
        },
    },
}); 

export const {loginUser, clearUser, Userpw} = user.actions; 

export default configureStore(
    {reducer:{
        user: user.reducer  
    }
})