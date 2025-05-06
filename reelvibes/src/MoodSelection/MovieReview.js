// MovieReview.js
import React, { useState, useEffect } from 'react';

const MovieReview = ({ currentUser, movieId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/reviews?movieId=${movieId}`);
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [movieId]);

    const handleReviewChange = (e) => setNewReview(e.target.value);
    const handleRatingClick = (rating) => setNewRating(rating);

    const handleSubmitReview = async () => {
        const review = {
            userId: currentUser.id,
            movieId,
            text: newReview,
            rating: newRating,
        };

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(review),
            });
            const newReviewData = await response.json();
            setReviews([newReviewData, ...reviews].slice(0, 5));
        } catch (error) {
            console.error("Error submitting review:", error);
        }

        setNewReview('');
        setNewRating(0);
        setShowReviewForm(false);
    };

    return (
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
                                className={index < newRating ? 'star-filled' : 'star-empty'}
                                style={{ cursor: 'pointer' }}
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
            <div className="reviews-list">
                {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                        <p>{review.text}</p>
                        <div className="rating">
                            {[...Array(5)].map((_, index) => (
                                <span
                                    key={index}
                                    className={index < review.rating ? 'star-filled' : 'star-empty'}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieReview;
