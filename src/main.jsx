import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import MovieDetails from './components/MovieDetails';
import './index.css'
import ActorMovies from './components/ActorMovies';
import GenrePage from './pages/GenrePage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/actor/:actorId" element={<ActorMovies />} />
      <Route path="/genre/:genreId" element={<GenrePage />} />
    </Routes>
  </BrowserRouter>
);
