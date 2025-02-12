import React, { useState } from 'react';
import { Mic } from 'lucide-react';

const Search = ({ searchTerm, setSearchTerm }) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState(''); // For live updates

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support voice search.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true; // Enable live updates
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setInterimText(''); // Clear previous text
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript + ' ';
        }
      }

      setInterimText(interimTranscript);
      if (finalTranscript) {
        setSearchTerm(finalTranscript);
        setInterimText(''); // Clear interim text once final transcript is available
      }
    };

    recognition.onerror = () => alert('Voice search error.');
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={interimText || searchTerm} // Show live text first
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleVoiceSearch} className="voice-search cursor-pointer">
          <Mic className={`w-6 h-6 ${isListening ? 'text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>
    </div>
  );
};

export default Search;
