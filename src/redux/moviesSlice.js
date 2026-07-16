import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = "https://www.omdbapi.com/?";
const apiKey = "apikey=18eaeb4f";


export const fetchMovies = createAsyncThunk(
    "movies/fetchMovies",
    async ({ searchTerm, page }) => {
        const response = await axios.get(`${api}${apiKey}&s=${searchTerm}&page=${page}`);
        return response.data;
    }
);

const moviesSlice = createSlice({
    name: "movies",
    initialState: {
        movies: [],
        totalResults: 0,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                const { Search, totalResults } = action.payload;
                state.isLoading = false;
                state.totalResults = Number(totalResults);
                if (action.meta.arg.page === 1) {
                    state.movies = Search || [];
                } else {
                    state.movies = [...state.movies, ...(Search || [])];
                }
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default moviesSlice.reducer;
