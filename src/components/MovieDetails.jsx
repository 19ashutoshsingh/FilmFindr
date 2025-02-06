// import React, { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { Clapperboard, Ghost, Sword, Brush, Smile, Rocket, Monitor, Music, BookOpen, Target, Landmark, Mic, Users, Brain, Heart } from 'lucide-react';

// const API_BASE_URL = 'https://api.themoviedb.org/3';
// const API_KEY = import.meta.env.VITE_TDMB_API_KEY;

// const API_OPTIONS = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: `Bearer ${API_KEY}`
//   }
// };

// // Genre Icons Mapping
// const genreIcons = {
//   Action: <Sword className="inline-block w-5 h-5 mr-1" />,
//   Adventure: <Rocket className="inline-block w-5 h-5 mr-1" />,
//   Animation: <Brush className="inline-block w-5 h-5 mr-1" />,
//   Comedy: <Smile className="inline-block w-5 h-5 mr-1" />,
//   Crime: <Target className="inline-block w-5 h-5 mr-1" />,
//   Documentary: <BookOpen className="inline-block w-5 h-5 mr-1" />,
//   Drama: <Users className="inline-block w-5 h-5 mr-1" />,
//   Fantasy: <Ghost className="inline-block w-5 h-5 mr-1" />,
//   History: <Landmark className="inline-block w-5 h-5 mr-1" />,
//   Horror: <Mic className="inline-block w-5 h-5 mr-1" />,
//   Music: <Music className="inline-block w-5 h-5 mr-1" />,
//   Mystery: <Brain className="inline-block w-5 h-5 mr-1" />,
//   Romance: <Heart className="inline-block w-5 h-5 mr-1" />,
//   SciFi: <Monitor className="inline-block w-5 h-5 mr-1" />,
//   Thriller: <Clapperboard className="inline-block w-5 h-5 mr-1" />
// };

// const MovieDetails = () => {
//   const { id } = useParams();
//   const [movie, setMovie] = useState(null);
//   const [trailer, setTrailer] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchMovieDetails = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/movie/${id}?append_to_response=videos`, API_OPTIONS);
//         if (!res.ok) throw new Error('Failed to fetch movie details');
        
//         const data = await res.json();
//         setMovie(data);

//         // Get trailer (YouTube link)
//         const trailers = data.videos?.results?.filter(vid => vid.type === 'Trailer' || vid.type === 'Teaser');
//         if (trailers && trailers.length > 0) {
//           const officialTrailer = trailers.find(vid => vid.official) || trailers[0];
//           // Check if trailer is available to view
//           if (officialTrailer) {
//             setTrailer(`https://www.youtube.com/embed/${officialTrailer.key}`);
//           }
//         }

//         // If no trailer is found, provide a link to YouTube search
//         if (!trailer) {
//           setTrailer(`https://www.youtube.com/results?search_query=${encodeURIComponent(data.title + " official trailer")}`);
//         }
//       } catch (err) {
//         setError('Error loading movie details.');
//       }
//     };

//     fetchMovieDetails();
//   }, [id, trailer]);  // Note: trailer is added to dependencies for the updated state

//   if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
//   if (!movie) return <p className="text-center text-gray-500 mt-4">Loading...</p>;

//   return (
//     <div className='pattern'>
//       <Link to="/">
//         <img src="../film_logo1.png" alt="Film Logo" className="w-30 h-12 absolute m-8" />
//       </Link>
//     <div className="max-w-5xl mx-auto my-15 py-8 px-10 text-gray-300 rounded-xl shadow-2xl transition-all">
//       <div className="grid md:grid-cols-2 gap-8 items-center">
//         {/* Movie Poster */}
//         <img 
//           src={movie.poster_path ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}` : '/no-movie.png'} 
//           alt={movie.title}
//           className="rounded-xl w-90 shadow-md mx-auto md:mx-0"
//           style={{ boxShadow: '0px 0px 5px 5px rgba(255, 255, 255, 0.3)' }}
//         />

//         {/* Movie Details */}
//         <div className="space-y-4">
//           <h1 className="text-4xl font-extrabold text-center 
//           bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent 
//           drop-shadow-lg tracking-wide uppercase">
//           {movie.title}
//           </h1>

//           {/* Genres */}
//           <p className="text-center flex flex-wrap justify-center gap-2 mt-4">
//             {movie.genres.map((genre) => (
//               <span 
//                 key={genre.id} 
//                 className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg flex items-center shadow-md"
//               >
//                 {genreIcons[genre.name] || <Clapperboard className="inline-block w-5 h-5 mr-1" />} 
//                 {genre.name}
//               </span>
//             ))}
//           </p>

//           <p><strong className="text-2xl">Overview:</strong><br/>{movie.overview}</p>
//           <p><strong className="text-xl">Rating:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
//           <p><strong className="text-xl">Release Date:</strong> {movie.release_date}</p>
//           <p><strong className="text-xl">Language:</strong> {movie.original_language.toUpperCase()}</p>
//         </div>
//       </div>

//       {/* Trailer Section */}
//       <div className="mt-15 text-center">
//         <h2 className="text-3xl font-semibold mb-4">Watch Trailer</h2>
//         {trailer.includes("youtube.com/embed/") ? (
//           <>
//             <div className="relative overflow-hidden rounded-lg shadow-2xl" style={{ paddingBottom: '56.25%', height: 0 }}>
//               <iframe 
//                 className="absolute top-0 left-0 w-full h-full rounded-lg"
//                 src={trailer} 
//                 title="Movie Trailer" 
//                 frameBorder="0"
//                 allowFullScreen 
//               ></iframe>
//             </div>
//             <p className="mt-4 text-lg">
//               Or, search the trailer on YouTube: 
//               <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " official trailer")}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
//                 Click here
//               </a>
//             </p>
//           </>
//         ) : (
//           <p className="mt-4 text-lg">
//             Trailer not available. Search it on YouTube: 
//             <a href={trailer} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
//               Click here
//             </a>
//           </p>
//         )}
//       </div>
//     </div>
//     </div>
//   );
// };

// export default MovieDetails;





import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clapperboard, Ghost, Sword, Brush, Smile, Rocket, Monitor, Music, BookOpen, Target, Landmark, Mic, Users, Brain, Heart } from 'lucide-react';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TDMB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/movie/${id}?append_to_response=videos,credits`, API_OPTIONS);
        if (!res.ok) throw new Error('Failed to fetch movie details');
        
        const data = await res.json();
        setMovie(data);

        // Get cast members
        setCast(data.credits?.cast?.slice(0, 10) || []);

        // Get trailer (YouTube link)
        const trailers = data.videos?.results?.filter(vid => vid.type === 'Trailer' || vid.type === 'Teaser');
        if (trailers && trailers.length > 0) {
          const officialTrailer = trailers.find(vid => vid.official) || trailers[0];
          if (officialTrailer) {
            setTrailer(`https://www.youtube.com/embed/${officialTrailer.key}`);
          }
        }

        if (!trailer) {
          setTrailer(`https://www.youtube.com/results?search_query=${encodeURIComponent(data.title + " official trailer")}`);
        }
      } catch (err) {
        setError('Error loading movie details.');
      }
    };

    fetchMovieDetails();
  }, [id, trailer]);

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!movie) return <p className="text-center text-gray-500 mt-4">Loading...</p>;

  return (
    <div className='pattern'>
      <Link to="/">
        <img src="../film_logo1.png" alt="Film Logo" className="w-30 h-12 absolute m-8" />
      </Link>
      <div className="max-w-5xl mx-auto my-15 py-8 px-10 text-gray-300 rounded-xl shadow-2xl transition-all">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img 
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}` : '/no-movie.png'} 
            alt={movie.title}
            className="rounded-xl w-90 shadow-md mx-auto md:mx-0"
            style={{ boxShadow: '0px 0px 5px 5px rgba(255, 255, 255, 0.3)' }}
          />

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide uppercase">
              {movie.title}
            </h1>
            <p className="text-center flex flex-wrap justify-center gap-2 mt-4">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg flex items-center shadow-md">
                  {genre.name}
                </span>
              ))}
            </p>
            <p><strong className="text-2xl">Overview:</strong><br/>{movie.overview}</p>
            <p><strong className="text-xl">Rating:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
            <p><strong className="text-xl">Release Date:</strong> {movie.release_date}</p>
            <p><strong className="text-xl">Language:</strong> {movie.original_language.toUpperCase()}</p>
          </div>
        </div>

        {/* Cast Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold mb-4 text-center">Cast</h2>
          <div className="relative">
            
            {/* Scrollable Cast List */}
            <div className="flex gap-6 overflow-x-auto px-4 py-4 bg-[#18152B] rounded-lg shadow-md scroll-smooth scrollbar-custom">
              {cast.map((actor) => (
                <div key={actor.id} className="flex flex-col items-center w-36 shrink-0">
                  <img 
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}` : '/no-avatar.png'} 
                    alt={actor.name} 
                    className="w-28 h-28 rounded-lg object-cover shadow-lg transition-transform duration-300 hover:scale-105"
                  />
                  <p className="mt-2 text-lg font-semibold text-center text-white">{actor.name}</p>
                  <p className="text-sm text-gray-100 text-center">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trailer Section */}
<div className="mt-15 text-center">
  <h2 className="text-3xl font-semibold mb-4">Watch Trailer</h2>
  {trailer.includes("youtube.com/embed/") ? (
    <>
      <div className="relative overflow-hidden rounded-lg shadow-2xl" style={{ paddingBottom: '56.25%', height: 0 }}>
        <iframe 
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={trailer} 
          title="Movie Trailer" 
          frameBorder="0"
          allowFullScreen 
        ></iframe>
      </div>
      <p className="mt-4 text-lg">
        Or watch it on YouTube: 
        <a 
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:underline"
        >
          Click here
        </a>
      </p>
    </>
  ) : (
    <p className="mt-4 text-lg">
      Trailer not available. Search it on YouTube: 
      <a 
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-400 hover:underline"
      >
        Click here
      </a>
    </p>
  )}

        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
