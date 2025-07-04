import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const genreMap = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Science Fiction": 878,
  "TV Movie": 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

const API_KEY = import.meta.env.VITE_TDMB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export default function ChatPopup({ onClose }) {
  const [step, setStep] = useState('askType');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTypeSubmit = () => {
    const choice = input.trim().toLowerCase();
    if (choice === 'genre') {
      setStep('askGenre');
      setInput('');
      setError('');
    } else if (choice === 'actor' || choice === 'actress') {
      setStep('askActor');
      setInput('');
      setError('');
    } else {
      setError('Please type either "genre" or "actor".');
    }
  };

  const handleGenreSubmit = () => {
    const genreName = Object.keys(genreMap).find(
      (name) => name.toLowerCase() === input.trim().toLowerCase()
    );
    if (genreName) {
      const genreId = genreMap[genreName];
      navigate(`/genre/${genreId}`);
      onClose();
    } else {
      setError('Please enter a valid genre.');
    }
  };

  const handleActorSubmit = async () => {
    const actorName = input.trim();
    if (!actorName) {
      setError('Please enter an actor/actress name.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(actorName)}`,
        API_OPTIONS
      );

      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const actorId = data.results[0].id;
        navigate(`/actor/${actorId}`);
        onClose();
      } else {
        setError('No actor/actress found with that name.');
      }
    } catch (err) {
      setError('Error searching for actor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (step === 'askType') handleTypeSubmit();
    else if (step === 'askGenre') handleGenreSubmit();
    else if (step === 'askActor') handleActorSubmit();
  };

  return (
    <div className="relative">
      {/* Bubble container */}
      <div className="fixed bottom-22 right-6 w-80 bg-white rounded-xl shadow-2xl p-4 z-50 text-black border border-gray-700">

        {/* Close + Content here */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-black">🎬 Movie Finder</h2>
          <button
            onClick={onClose}
            className="text-black hover:text-red-400 text-xl cursor-pointer"
          >
            ✖
          </button>
        </div>

        <p className="mb-2">
          {step === 'askType' && 'Do you want to search by genre or actor/actress?'}
          {step === 'askGenre' && 'What genre would you like to watch?'}
          {step === 'askActor' && 'Enter the name of the actor or actress:'}
        </p>

        <input
          type="text"
          className="w-full border border-gray-600 bg-gray-800 text-white rounded px-3 py-2 mb-2"
          placeholder="Type here..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError('');
          }}
        />

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        {loading && <p className="text-sm text-blue-400">Searching...</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Submit
        </button>
      </div>

      {/* Triangle Tail */}
      <div className="fixed bottom-[82px] right-[45px] w-4 h-4 bg-white rotate-45 z-40 border-l border-t border-gray-700" />
    </div>

  );
}
