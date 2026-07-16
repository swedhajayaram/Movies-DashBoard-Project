import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice';
import moviesReducer from './moviesSlice'

const store = configureStore({
  reducer: {
    session: sessionReducer,
    movies: moviesReducer,
  },
  
});

export default store;
