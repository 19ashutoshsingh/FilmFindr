import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import MovieCardSkeleton from "../components/MovieCardSkeleton";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TDMB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

// Map genre IDs to names
const genreNamesById = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const GenrePage = () => {
  const { genreId } = useParams();
  const genreName = genreNamesById[genreId] || "Genre";
  const [movies, setMovies] = useState([]);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchGenreMovies = async (page = 1) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`,
        API_OPTIONS
      );

      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setErrorMessage("No movies found for this genre.");
        return;
      }

      setMovies(data.results);
      setMovieList(data.results.slice(0, 20)); // Optional: only needed if API returns > 20
      setTotalPages(Math.min(data.total_pages, 500));
    } catch (err) {
      setErrorMessage("Failed to fetch genre movies.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchGenreMovies(1);
  }, [genreId]);

  useEffect(() => {
    fetchGenreMovies(currentPage);
  }, [currentPage]);

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
          {genreName} Movies
        </h1>

        <section className="all-movies mt-10">
          {isLoading ? (
            <MovieCardSkeleton />
          ) : errorMessage ? (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
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

export default GenrePage;
