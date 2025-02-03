import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie: { id, title, vote_average, poster_path, release_date, original_language } }) => {
  return (
    <div className="movie-card">
      <img 
        src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'} 
        alt={title}
      />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
          
          {/* View More Button */}
          <Link to={`/movie/${id}`} className="bg-blue-500 text-white px-3 py-1 mx-2 rounded-md text-sm hover:bg-blue-600 transition-all duration-400 ease">
            View More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
