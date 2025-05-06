import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./../styles/MoodPage.css";

const MoviePage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const title = searchParams.get("title");
    const poster = searchParams.get("poster");
    const year = searchParams.get("year");
    const actors = searchParams.get("actors");
    const overview = searchParams.get("overview");

    const [movieDetails, setMovieDetails] = useState({});
    const [reviews, setReviews] = useState([
        { id: 1, text: "Amazing movie! Highly recommend!", rating: 5 },
        { id: 2, text: "Great acting, but the plot was weak.", rating: 3 },
        { id: 3, text: "Loved it! So much fun.", rating: 4 },
        { id: 4, text: "Good movie, could have been better", rating: 3 },
        { id: 5, text: "A must-watch for sports fans", rating: 4 },
    ]);
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [platforms, setPlatforms] = useState({});

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const tmdbAPIKey = "d82d3a80c9017ae8fcb333dd3ad95ecc";
                const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbAPIKey}&query=${encodeURIComponent(title)}`;
                const response = await fetch(searchURL);
                const data = await response.json();
                const movie = data.results?.[0];

                if (movie) {
                    const providersURL = `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${tmdbAPIKey}`;
                    const providersResponse = await fetch(providersURL);
                    const providersData = await providersResponse.json();
                    setPlatforms(providersData.results?.US || {});

                    setMovieDetails({
                        plot: movie.overview || "No plot available",
                    });
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovieDetails();
    }, [title]);

    const handleReviewChange = (e) => setNewReview(e.target.value);
    const handleRatingClick = (rating) => setNewRating(rating);

    const handleSubmitReview = () => {
        const review = {
            id: reviews.length + 1,
            text: newReview,
            rating: newRating,
        };
        setReviews([review, ...reviews].slice(0, 5));
        setNewReview("");
        setNewRating(0);
        setShowReviewForm(false);
    };

    return (
        <div className="movie-page">
            <div className="movie-overlay">
                <div className="movie-page-text">
                    <h1
                        className="movie-ind-title"
                        style={{
                            marginBottom: "20px",
                            color: "white",
                            textAlign: "center",
                            textShadow: "0 0 5px #00bfff, 0 0 10px #00bfff, 0 0 20px #00bfff, 0 0 40px #00bfff",
                        }}
                    >
                        {title}
                    </h1>
                </div>

                <div className="movie-info-section">
                    <img src={poster} alt={title} className="movie-poster movie-poster-II" />

                    <div className="movie-info-text">

                        {/* Platforms Section */}
                        {platforms && (
                            <div className="platforms-section">
                                <h2 className="movie-ind-title">Available On</h2>

                                {platforms.flatrate && (
                                    <div className="details-item">
                                        <p><strong>Streaming On:</strong></p>
                                        <div className="platform-icons">
                                            {platforms.flatrate.map((provider) => {
                                                // Manually map some known providers
                                                const providerName = provider.provider_name.toLowerCase().replace(" ", "");
                                                let providerUrl = `https://www.${providerName}.com`; // Default

                                                // If the provider has a special link
                                                if (providerName === 'googleplaymovies') {
                                                    providerUrl = "https://play.google.com/store/movies"; // Google Play Movies URL
                                                } else if (providerName === 'amazon') {
                                                    providerUrl = "https://www.amazon.com/"; // Amazon URL
                                                } // Add more known providers as needed

                                                return (
                                                    <a key={provider.provider_id} href={providerUrl} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                            alt={provider.provider_name}
                                                        />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {platforms.rent && (
                                    <div className="details-item">
                                        <p><strong>Available for Rent:</strong></p>
                                        <div className="platform-icons">
                                            {platforms.rent.map((provider) => {
                                                const providerName = provider.provider_name.toLowerCase().replace(" ", "");
                                                let providerUrl = `https://www.${providerName}.com`; // Default

                                                if (providerName === 'googleplaymovies') {
                                                    providerUrl = "https://play.google.com/store/movies";
                                                } else if (providerName === 'amazon') {
                                                    providerUrl = "https://www.amazon.com/";
                                                }

                                                return (
                                                    <a key={provider.provider_id} href={providerUrl} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                            alt={provider.provider_name}
                                                        />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {platforms.buy && (
                                    <div className="details-item">
                                        <p><strong>Available to Buy:</strong></p>
                                        <div className="platform-icons">
                                            {platforms.buy.map((provider) => {
                                                const providerName = provider.provider_name.toLowerCase().replace(" ", "");
                                                let providerUrl = `https://www.${providerName}.com`; // Default

                                                if (providerName === 'googleplaymovies') {
                                                    providerUrl = "https://play.google.com/store/movies";
                                                } else if (providerName === 'amazon') {
                                                    providerUrl = "https://www.amazon.com/";
                                                }

                                                return (
                                                    <a key={provider.provider_id} href={providerUrl} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                            alt={provider.provider_name}
                                                        />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                        {/* Details Section */}
                        <div className="details-section">
                            <h2 className="movie-ind-title">Movie Details</h2>
                            <div className="details-item">
                                <p><strong>Plot:</strong> {movieDetails.plot}</p>
                            </div>
                            <div className="details-item">
                                <p><strong>Actors:</strong> {actors}</p>
                            </div>
                            <div className="details-item">
                                <p><strong>Year:</strong> {year}</p>
                            </div>
                        </div>

                    </div>
                </div>
                

                {/* Reviews Section */}
                <div className="reviews-section">
                {!showReviewForm ? (
                        <button className="start-button" onClick={() => setShowReviewForm(true)}>
                            Write a Review
                        </button>
                    ) : (
                        <div className="review-form">
                            <div className="textarea-wrapper">
                                <textarea
                                    placeholder="Write your review..."
                                    value={newReview}
                                    onChange={handleReviewChange}
                                    rows="5"
                                    cols="50"
                                    maxLength="200"
                                    className="review-textarea"
                                />
                                <div className="character-limit">
                                    {newReview.length} / 200 characters
                                </div>
                            </div>

                            <div className="rating">
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        onClick={() => handleRatingClick(index + 1)}
                                        className={index < newRating ? "star-filled" : "star-empty"}
                                        style={{ cursor: "pointer" }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <button className="start-button" onClick={handleSubmitReview}>
                                Submit Review
                            </button>
                        </div>
                    )}
                    <h2 className="recent-review">Recent Reviews</h2>
                    <div className="reviews-section-overlay"></div>
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review.id} className="review-item">
                                <p>{review.text}</p>
                                <div className="rating">
                                    {[...Array(5)].map((_, index) => (
                                        <span
                                            key={index}
                                            className={index < review.rating ? "star-filled" : "star-empty"}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    
                </div>

            </div>
        </div>
    );
};

export default MoviePage;
