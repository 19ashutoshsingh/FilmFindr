import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MovieCard from "./MovieCard"; 
import MovieCardSkeleton from "./MovieCardSkeleton";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TDMB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const ActorMovies = () => {
  const { actorId } = useParams();
  const [movies, setMovies] = useState([]);
  const [movieList, setMovieList] = useState([]);
  const [actorDetails, setActorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchActorData = async () => {
      try {
        setIsLoading(true);

        // Fetch actor details
        const actorRes = await fetch(`${API_BASE_URL}/person/${actorId}`, API_OPTIONS);
        if (!actorRes.ok) throw new Error("Failed to fetch actor details");
        const actorData = await actorRes.json();
        setActorDetails(actorData);

        // Fetch actor's movies
        const moviesRes = await fetch(`${API_BASE_URL}/person/${actorId}/movie_credits`, API_OPTIONS);
        if (!moviesRes.ok) throw new Error("Failed to fetch actor's movies");
        const moviesData = await moviesRes.json();

        setMovies(moviesData.cast || []);
        setMovieList(moviesData.cast.slice(0, 20)); // Show first 20 movies
        setTotalPages(Math.ceil((moviesData.cast.length || 1) / 20));

      } catch (error) {
        setErrorMessage("Failed to load data.");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActorData();
  }, [actorId]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setMovieList(movies.slice((newPage - 1) * 20, newPage * 20)); // Paginate movies
    }
  };

  const handlePageInput = (e) => {
    setPageInput(e.target.value);
  };

  const goToPage = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  return (
    <div className="pattern">
      <Link to="/">
        <img src="../film_logo1.png" alt="Film Logo" className="w-30 h-12 absolute m-8" />
      </Link>

      <div className="wrapper">
        <h1 className="mt-10 text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide uppercase">
            {actorDetails ? actorDetails.name : "Loading..."}
        </h1>
        {isLoading ? (
          <MovieCardSkeleton />
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : actorDetails ? (
          <div className="max-w-5xl mx-auto py-8 text-gray-300 rounded-xl shadow-2xl transition-all">
            <div className="grid md:grid-cols-[1fr_2fr] gap-2 items-center">
              {/* Actor Image */}
              <img
                src={actorDetails.profile_path ? `https://image.tmdb.org/t/p/w300/${actorDetails.profile_path}` : '/no-profile.png'}
                alt={actorDetails.name}
                className="rounded-xl w-75 shadow-md mx-auto md:mx-0"
                style={{ boxShadow: '0px 0px 5px 5px rgba(255, 255, 255, 0.3)' }}
              />

              {/* Actor Details */}
              <div className="space-y-4">
                <p className="text-xl"><strong>Born:</strong> {actorDetails.birthday} in {actorDetails.place_of_birth}</p>
                <p className="text-xl"><strong>Popularity:</strong> {actorDetails.popularity.toFixed(1)}</p>
                <p className="text-justify"><strong className="text-2xl">Biography:</strong><br/>{actorDetails.biography || "No biography available."}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Movies Section */}
        <section className="all-movies mt-10">
          <h2 className="text-3xl font-semibold text-center mb-10">{actorDetails?.name}'s Movies</h2>

          {movieList.length === 0 ? (
            <p className="text-gray-400 text-center mt-4">No movies found for this actor.</p>
          ) : (
            <>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>

              {/* Pagination Controls */}
              <div className="pagination flex justify-center items-center gap-4 mt-6">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1} 
                  className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 cursor-pointer"
                >
                  Prev
                </button>

                <input 
                  type="number" 
                  value={pageInput} 
                  onChange={handlePageInput} 
                  placeholder={`Page ${currentPage}`} 
                  className="text-white border border-gray-500 rounded px-2 py-1 w-20 text-center appearance-none page-input" 
                  style={{ MozAppearance: "textfield" }} 
                />

                <button 
                  onClick={goToPage} 
                  className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 cursor-pointer"
                >
                  Go
                </button>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages} 
                  className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ActorMovies;
