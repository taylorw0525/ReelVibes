export const fetchReviews = async (movieId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reviews/movie/${movieId}`);
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Error fetching reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  };
  
  export const postReview = async (userId, movieId, content, rating) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, movieId, content, rating }),
      });
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };
  
  export const editReview = async (reviewId, content, rating) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, rating }),
      });
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  };
  
  export const deleteReview = async (reviewId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        return true;
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  };
  