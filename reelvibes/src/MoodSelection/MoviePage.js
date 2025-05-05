import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./../styles/MoodPage.css"; //Importing MoodPage styles

const MoviePage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
   
    const title = searchParams.get("title");
    const poster = searchParams.get("poster");
    const year = searchParams.get("year");
    const actors = searchParams.get("actors");
    const overview = searchParams.get("overview");

    const [movieDetails, setMovieDetails] = useState({});
    const [reviews, setReviews] = useState ([
        { id: 1, text: "Amazing movie! Highly recommend!", rating: 5},
        { id: 2, text: "Great acting, but the plot was weak.", rating: 3},
        { id: 3, text: "Loved it! So much fun.", rating: 4},
        { id: 4, text: "Good movie, could have been better", rating: 3},
        { id: 5, text: "A must-watch for sports fans", rating: 4},
    ]);
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [platforms, setPlatforms] = useState({
        buy: "Not available",
        rent: "Not available",
        stream: "Not available"
    });

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const tmdbAPIKey = "d82d3a80c9017ae8fcb333dd3ad95ecc";
                const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbAPIKey}&query=${encodeURIComponent(title)}`;
                const response = await fetch(API_URL);
                const data = await response.json();
                const movie = data.results[0];

                if (movie) {
                    const providersURL = `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${tmdbAPIKey}`;
                    const providersResponse = await fetch(providersURL);
                    const providersData = await providersResponse.json();
                    
                    console.log(providersData);

                    const providers = providersData.results?.US || {}; //Check for availablility in the US

                    setPlatforms({
                        buy: providers.buy ? providers.buy.map(p => p.provider_name).join(", ") : "Not available",
                        rent: providers.rent ? providers.rent.map(p => p.provider_name).join(", ") : "Not available",
                        stream: providers.flatrate ? providers.flatrate.map(p => p.provider_name).join(", ") : "Not available",
                    });

                    setMovieDetails({
                        plot: movie.overview || "No plot available",
                    });
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovieDetails();
    }, [title]); //Depend on title to refetch if it changes


    const handleReviewChange = (e) => {
        setNewReview(e.target.value);
    };

    const handleRatingClick = (rating) => {
        setNewRating(rating);
    };

    const handleSubmitReview = () => {
        const review = {
            id: reviews.length + 1,
            text: newReview,
            rating: newRating,
        };
        setReviews([review, ...reviews].slice(0,5)); //Adding to the top and limiting to 5 reviews
        setNewReview(""); //Reset input
        setNewRating(0); //Reset rating
        setShowReviewForm(false); //Hide review form after submission
    };


    console.log(location.search);
    console.log();

    return (
        <div className="movie-page">
            <div className="movie-overlay">
                <div className="movie-page-text">
                    <h1 className="movie-ind-title"
                    style={{
                        marginBottom: "20px",
                        color: "white",
                        textAlign: "center",
                        textShadow: "0 0 5px #00bfff, 0 0 10px #00bfff, 0 0 20px #00bfff, 0 0 40px #00bfff"
                        }}>
                            {title}
                        </h1>
                    </div>

                    <div className="movie-info-section">
                        <img src={poster} alt={poster} width="300" className="movie-poster"/>
                            
                        <div className="movie-info-text">
                            {/* Right Rectangle */}
                            <div className="platforms-rectangle">
                                <p><strong>Streaming Platforms:</strong></p>{platforms.stream}
                                <p><strong>Rental Platforms:</strong></p>{platforms.rent}
                                <p><strong>Available for Purchase:</strong></p>{platforms.buy}
                            </div>

                            {/* Right Rectangle */}
                            <div className="details-rectangle">
                                <p><strong>Plot:</strong></p>{movieDetails.plot}
                                <p><strong>Actors:</strong></p>{actors}
                                <p><strong>Year:</strong></p>{year}
                            </div>
                        </div>
                    </div>
                    

                    <div className="reviews-section">
                        <h2 className="movie-ind-title">Recent Reviews</h2>
                        <div className="reviews-section-overlay"></div>
                        <div className="reviews-list">
                            {reviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    <p>{review.text}</p>
                                    <div className="rating">
                                        {[...Array(5)].map((_, index) => (
                                            <span key={index} className={index < review.rating ? "star-filled" : "star-empty"}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!showReviewForm ? (
                            <button
                                className="start-button"
                                onClick={() => setShowReviewForm(true)}
                            >
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
                                    maxLength="200" //Character limit
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
                </div>
            </div>
        </div>
    );
};

export default MoviePage;