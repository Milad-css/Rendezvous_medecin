    import { createSlice } from "@reduxjs/toolkit";

    const initialState = {
        user: JSON.parse(localStorage.getItem('user')) || null,       //rend le text en objet pour le stocker dans user
        isAuthenticated: localStorage.getItem('token') ? true:false , // Plus robuste
    };

    const authSlice = createSlice({
        name: "auth", // Le nom de la slice (utilisé pour les types d'actions)
        initialState,
        reducers: {
            setCredentials: (state, action) => {
                // On peut destructurer action.payload pour plus de clarté
                const { user, token } = action.payload;
                state.user = user;
                state.token = token; 
                state.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);
            },

            logout: (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            },
        },
    });

    export const { setCredentials, logout } = authSlice.actions;
    export default authSlice.reducer;