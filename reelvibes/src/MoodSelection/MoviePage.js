import React from "react";
import { useLocation } from "react-router-dom";
import "./../styles/MoodPage.css"; //Importing MoodPage styles

const MoviePage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
   
    const title = searchParams.get("title");
    const poster = searchParams.get("poster");
    const year = searchParams.get("year");
    const actors = searchParams.get("actors");

    console.log(location.search);

    return (
        <div className="movie-page">
            <div className="overlay">
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
                            <p className="movie-ind-description">
                                <strong>Year:</strong> {year}
                            </p>
                            <p className="movie-ind-description">
                                <strong>Actors:</strong> {actors}
                            </p>
                        </div>
                    </div>
                    
                    <div className="movie-page-text">
                        <h2 className="movie-ind-title" style={{ marginTop: "30px"}}>
                            Write a Review
                        </h2>
                        <textarea placeholder="Write your review..." rows="5" cols="50" />
                        <br />
                        <button className="start-button" style={{ marginTop: "10px" }}>
                            Submit Review
                        </button>
                    </div>
            </div>
        </div>
    );
};

export default MoviePage;