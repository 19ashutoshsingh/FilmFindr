import React, { useEffect, useState, useRef } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';
import MovieCardSkeleton from './components/MovieCardSkeleton';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TDMB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // 🚀 New state to track search execution

  const allMoviesRef = useRef(null);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 750, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'No movies found.');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query) {
        setHasSearched(true); // ✅ Set to true only when a search is performed
        if (data.results.length > 0) {
          await updateSearchCount(query, data.results[0]);
        }
      }
      
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 Scroll when movieList updates but ONLY if a search was executed
  useEffect(() => {
    if (hasSearched && movieList.length > 0 && allMoviesRef.current) {
      console.log('Scrolling to All Movies section...');
      allMoviesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [movieList, hasSearched]); // ✅ Added hasSearched as a dependency

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner' />
          <h1>
            Effortless <span className='text-gradient'>Movie</span> Discovery, Just for You.
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* All Movies Section with Scroll Ref */}
        <section ref={allMoviesRef} className='all-movies'>
          <h2>All Movies</h2>
          {isLoading ? (
            <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <MovieCardSkeleton key={index} />
              ))}
            </div>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all z-10 cursor-pointer text-xl"
        >
          ☝
        </button>
      )}
    </main>
  );
};

export default App;
