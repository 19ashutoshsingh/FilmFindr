import React, { useEffect, useState, useRef } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';
import MovieCardSkeleton from './components/MovieCardSkeleton';
import { Link } from 'react-router-dom';

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
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState('');

  const allMoviesRef = useRef(null);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 750, [searchTerm]);

  // const fetchMovies = async (query = '', page = 1) => {
  //   setIsLoading(true);
  //   setErrorMessage('');

  //   try {
  //     const endpoint = query
  //       ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
  //       : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

  //     const response = await fetch(endpoint, API_OPTIONS);

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch movies');
  //     }

  //     const data = await response.json();

  //     if (data.results.length === 0) {
  //       setErrorMessage('No movies found.');
  //       setMovieList([]);
  //       return;
  //     }

  //     setMovieList(data.results || []);
  //     setTotalPages(data.total_pages);
      
  //     if (query) {
  //       setHasSearched(true);
  //       if (data.results.length > 0) {
  //         await updateSearchCount(query, data.results[0]);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(`Error fetching movies: ${error}`);
  //     setErrorMessage('Error fetching movies. Please try again later.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchMovies = async (query = '', page = 1) => {
    setIsLoading(true);
    setErrorMessage('');
  
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
  
      const response = await fetch(endpoint, API_OPTIONS);
  
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
  
      const data = await response.json();
  
      if (data.results.length === 0) {
        setErrorMessage('No movies found.');
        setMovieList([]);
        return;
      }
  
      setMovieList(data.results || []);
      
      // Cap totalPages at 500 if using discover/movie
      const maxPages = query ? data.total_pages : Math.min(data.total_pages, 500);
      setTotalPages(maxPages);
  
      if (query) {
        setHasSearched(true);
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
  

  useEffect(() => {
    if (hasSearched && movieList.length > 0 && allMoviesRef.current) {
      allMoviesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [movieList, hasSearched]);

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, currentPage);
  }, [debouncedSearchTerm, currentPage]);

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

  useEffect(() => {
    // Sync pageInput with currentPage when it changes
    setPageInput(currentPage);
  }, [currentPage]);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageInput = (e) => {
    setPageInput(e.target.value);
  };

  const goToPage = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <main>
      <div className='pattern' />
      <Link to="/">
        <img src="./film_logo1.png" alt="Film Logo" className="w-30 h-12 absolute m-8" />
      </Link>
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

        <section ref={allMoviesRef} className='all-movies'>
          <h2>All Movies</h2>
          {isLoading ? (
            <MovieCardSkeleton />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <>
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
              <div className="pagination flex justify-center items-center gap-4 mt-6">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1} 
                  className='px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 cursor-pointer'
                >
                  Prev
                </button>

                <input 
                  type="number" 
                  value={pageInput} 
                  onChange={handlePageInput} 
                  placeholder={`Page ${currentPage}`} 
                  className='text-white border border-gray-500 rounded px-2 py-1 w-20 text-center appearance-none page-input' style={{ MozAppearance: 'textfield' }} 
                />

                <button 
                  onClick={goToPage} 
                  className='px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 cursor-pointer'
                >
                  Go
                </button>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages} 
                  className='px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 cursor-pointer'
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
