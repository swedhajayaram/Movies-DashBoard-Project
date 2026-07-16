import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../redux/moviesSlice";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MoviesDashboard.css";

const api = "https://www.omdbapi.com/?";
const apiKey = "apikey=18eaeb4f";

function MoviesDashboard() {
    const dispatch = useDispatch();
    const { movies, isLoading, error, totalResults } = useSelector((state) => state.movies);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        dispatch(fetchMovies({ searchTerm: searchTerm || "Avengers", page, genre: selectedGenre }));
    }, [searchTerm, page, selectedGenre, dispatch]);

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !isLoading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [isLoading, hasMore]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (totalResults && movies.length >= totalResults) {
            setHasMore(false);
        }
    }, [movies, totalResults]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setHasMore(true);
        dispatch(fetchMovies({ searchTerm, page: 1, genre: selectedGenre }));
    };

    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value);
    };

    const handleFavoriteToggle = (movie) => {
        let updatedFavorites = [...favorites];
        if (updatedFavorites.some(fav => fav.imdbID === movie.imdbID)) {
            updatedFavorites = updatedFavorites.filter(fav => fav.imdbID !== movie.imdbID);
        } else {
            updatedFavorites.push(movie);
        }
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
    };

    return (
        <div className="movies-dashboard">
            <div className="overlay"></div>
            <div className="container my-5 position-relative">
                <h1 className="text-center text-white mb-4">🎬 Movies Dashboard</h1>

                <form className="mb-4" onSubmit={handleSearch}>
                    <div className="d-flex justify-content-between">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search for movies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select className="form-control-w-" value={selectedGenre} onChange={handleGenreChange}>
                            <option value="">All Genres</option>
                            <option value="favorites">Favorites</option>
                        </select>
                    </div>
                </form>

                {isLoading && page === 1 ? (
                    <div className="text-center my-4">
                        <div className="spinner-border text-white" role="status"></div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger text-center" role="alert">
                        Error: {error}
                    </div>
                ) : (
                    <div className="row">
                        {(selectedGenre === 'favorites' ? favorites : movies).map((movie) => (
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={movie.imdbID}>
                                <div className="card h-100 shadow-lg bg-dark text-white">
                                    <Link to={`/movie/${movie.imdbID}`}>
                                        <img
                                            src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}
                                            className="card-img-top"
                                            alt={movie.Title}
                                            style={{ height: "350px", objectFit: "cover" }}
                                        />
                                    </Link>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-truncate">{movie.Title}</h5>
                                        <p className="card-text">
                                            <strong>Release:</strong> {movie.Year}
                                        </p>
                                        <p className="card-text text-warning">
                                            <strong>Rating:</strong> {Math.floor(Math.random() * 10) + 1}/10
                                        </p>
                                        <button
                                            className={`btn btn-${favorites.some(fav => fav.imdbID === movie.imdbID) ? 'danger' : 'primary'} mt-auto`}
                                            onClick={() => handleFavoriteToggle(movie)}
                                        >
                                            {favorites.some(fav => fav.imdbID === movie.imdbID) ? 'Unfavorite' : 'Favorite'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isLoading && page > 1 && (
                    <div className="text-center my-4">
                        <div className="spinner-border text-white" role="status"></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MoviesDashboard;
