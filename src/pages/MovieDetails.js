
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MoviesDashboard.css"; 

const omdbApi = "https://www.omdbapi.com/";
const apiKey = "apikey=18eaeb4f";  

function MovieDetails() {
    const { id } = useParams(); 
    const [movieDetails, setMovieDetails] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const navigate = useNavigate();  
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`${omdbApi}?i=${id}&${apiKey}&plot=full`);
                setMovieDetails(response.data);

                
                const youtubeTrailer = response.data.Videos?.find(video => video.site === "YouTube" && video.type === "Trailer");
                setTrailer(youtubeTrailer ? `https://www.youtube.com/embed/${youtubeTrailer.key}` : null);

               
                const similarMoviesResponse = await axios.get(`${omdbApi}?s=${movieDetails.Title}&type=movie&apikey=${apiKey}`);
                setSimilarMovies(similarMoviesResponse.data.Search || []);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovieDetails();
    }, [id, movieDetails]);

    const handleLogout = () => {
        
        localStorage.removeItem("authToken");
        navigate("/login");  
    };

    if (!movieDetails) {
        return <div className="text-center text-white ">Loading...</div>;
    }

    return (
        <div className="movie-details-container">
            <div className="overlay"></div> 

            <div className="container  position-relative">
                <h1 className="text-center text-white mb-4">🎬 Movie Details</h1>

              
                <button onClick={handleLogout} className="btn btn-danger mb-4">
                    Logout
                </button>

                
                <div className="row mb-4">
                    <div className="col-md-4">
                        <img
                            src={movieDetails.Poster !== "N/A" ? movieDetails.Poster : "https://via.placeholder.com/300"}
                            alt={movieDetails.Title}
                            className="img-fluid rounded shadow"
                        />
                    </div>
                    <div className="col-md-8">
                        <h2 className="text-white">{movieDetails.Title}</h2>
                        <p><strong>Release Date:</strong> {movieDetails.Released}</p>
                        <p><strong>Runtime:</strong> {movieDetails.Runtime}</p>
                        <p><strong>Genre:</strong> {movieDetails.Genre}</p>
                        <p><strong>IMDB Rating:</strong> {movieDetails.imdbRating}/10</p>
                        <p>{movieDetails.Plot}</p>
                    </div>
                </div>

                {/* Trailer */}
                {trailer && (
                    <div className="mb-4">
                        <h3 className="text-white">Trailer</h3>
                        <iframe
                            width="100%"
                            height="500"
                            src={trailer}
                            frameBorder="0"
                            allowFullScreen
                            title="Movie Trailer"
                            className="rounded"
                        ></iframe>
                    </div>
                )}

                {/* Similar Movies */}
                <div>
                    <h3 className="text-white">Similar Movies</h3>
                    <div className="row">
                        {similarMovies.length > 0 ? (
                            similarMovies.map((movie) => (
                                <div className="col-md-4 col-sm-6 mb-4" key={movie.imdbID || movie.Title}>
                                    <div className="card bg-dark text-white h-100">
                                        <img
                                            src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}
                                            className="card-img-top"
                                            alt={movie.Title}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate">{movie.Title}</h5>
                                            <p className="card-text">Release Date: {movie.Year}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white">No similar movies found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetails
