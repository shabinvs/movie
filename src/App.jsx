import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const randomMovieList = [
  "Inception", "Avengers", "Interstellar", "Titanic", "Joker",
  "The Matrix", "Gladiator", "Dark Knight", "Avatar", "Deadpool",
  "Harry Potter", "The Godfather", "The Shawshank Redemption",
  "Forrest Gump", "Spider-Man", "Iron Man", "Star Wars", "Black Panther"
];

// Remove duplicates by imdbID
const uniqueByImdbID = (movies) => {
  const seen = new Set();
  return movies.filter((movie) => {
    if (seen.has(movie.imdbID)) return false;
    seen.add(movie.imdbID);
    return true;
  });
};

const App = () => {
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topMovies, setTopMovies] = useState([]);
  const navigate = useNavigate();

  const resultRef = useRef(null);

  // Fetch random top movies on mount
  const fetchTopMovies = async () => {
    const randomName = randomMovieList[Math.floor(Math.random() * randomMovieList.length)];
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${randomName}&apikey=a5ef1268`
      );
      if (response.data.Response === "True") {
        const moviesWithPosters = response.data.Search.filter(
          (movie) => movie.Poster && movie.Poster !== "N/A"
        );
        const uniqueMovies = uniqueByImdbID(moviesWithPosters).slice(0, 8);
        setTopMovies(uniqueMovies);
      }
    } catch (err) {
      console.error("Top movies fetch failed", err);
    }
  };

  useEffect(() => {
    fetchTopMovies();
  }, []);

  const handleChange = (e) => setName(e.target.value);

  const movieSearch = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a movie name");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setData(null);

      const response = await axios.get(
        `https://www.omdbapi.com/?s=${name}&apikey=a5ef1268`
      );

      if (response.data.Response === "False") {
        setError("🎬 Movie not found! Try another title.");
        setData(null);
      } else {
        setData(response.data.Search);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setError("⚠️ Something went wrong. Please try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setName("");
    setData(null);
    setError(null);
  };

  // Scroll to search results when data updates
  useEffect(() => {
    if (data && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [data]);

  return (
    <div className="text-white font-sans bg-gradient-to-tr from-[#041C32] via-[#04293A] to-[#064663] min-h-screen">

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_#ffffff10,_#00000000)]" />

        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
          <h1 className="text-6xl sm:text-7xl font-extrabold text-cyan-400 drop-shadow-lg tracking-tight">
            <span className="text-white">Movie</span>
            <span className="text-cyan-400">Finder</span>
          </h1>
          <p className="text-cyan-100 mt-4 text-lg sm:text-xl font-light max-w-xl">
            Instantly discover your favorite movies and explore cinematic gems from around the world.
          </p>

          {/* Search Form */}
          <form
            onSubmit={movieSearch}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-6 mt-10 rounded-3xl shadow-xl transition duration-200 hover:shadow-cyan-500/20"
          >
            <input
              type="text"
              value={name}
              onChange={handleChange}
              placeholder="Search for a movie title..."
              className="w-full p-4 rounded-full bg-black/70 text-white border border-cyan-400 placeholder-cyan-300 text-center text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Search for a movie title"
            />
            <div className="flex justify-center mt-4 gap-4 flex-wrap">
              <button
                type="submit"
                className="bg-cyan-500 text-black font-semibold px-6 py-2 rounded-full shadow-md hover:bg-cyan-400 hover:scale-105 transition"
                disabled={loading}
              >
                {loading ? "Searching..." : "🔍 Search"}
              </button>
              <button
                type="button"
                onClick={resetSearch}
                className="bg-red-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-red-400 hover:scale-105 transition"
                disabled={loading}
              >
                ⏪ Reset
              </button>
            </div>
          </form>

          {error && (
            <div className="flex items-center gap-3 mt-6 bg-red-900/80 p-4 rounded-xl shadow-md border border-red-600 max-w-md mx-auto">
              <span className="text-red-400 text-2xl" role="img" aria-label="Error">
                ⚠️
              </span>
              <p className="text-red-400 text-lg font-semibold">
                {error}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Search Results Section */}
      {data && (
        <section ref={resultRef} className="mt-10 mb-20 w-full max-w-6xl mx-auto px-6 z-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-cyan-300 border-b border-cyan-500 pb-3 uppercase tracking-wide">
            Search Results
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {data.map((movie) => (
              <li
                key={movie.imdbID}
                className="bg-black/60 p-4 rounded-2xl shadow-lg hover:shadow-cyan-400/30 transition hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/movies/${movie.imdbID}`)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/movies/${movie.imdbID}`);
                }}
                aria-label={`View details for ${movie.Title}`}
              >
                <img
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={movie.Title}
                  className="rounded-xl w-full h-72 object-cover"
                  loading="lazy"
                />
                <h5 className="mt-4 text-lg font-semibold text-cyan-300 text-center">
                  {movie.Title}
                </h5>
                <p className="text-sm text-cyan-100 text-center">Year: {movie.Year}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Top Picks Section - show only when no search */}
      {!data && (
        <section className="py-20 px-6 bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#3A506B]">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-cyan-300 mb-10">
            🍿 Top Picks for You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {topMovies
              .filter((movie) => movie.Poster && movie.Poster !== "N/A")
              .map((movie) => (
                <div
                  key={movie.imdbID}
                  className="bg-black/60 p-4 rounded-xl shadow-md hover:shadow-cyan-500/30 transition hover:scale-105 text-center cursor-pointer"
                  onClick={() => navigate(`/movies/${movie.imdbID}`)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigate(`/movies/${movie.imdbID}`);
                  }}
                  aria-label={`View details for ${movie.Title}`}
                >
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="rounded-xl h-72 w-full object-cover"
                    loading="lazy"
                  />
                  <h5 className="mt-3 text-cyan-200 font-medium">{movie.Title}</h5>
                  <p className="text-sm text-cyan-100">Year: {movie.Year}</p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black text-center py-6 border-t border-cyan-800 text-sm text-cyan-300">
        Made with ❤️ by Shabin | Powered by OMDB API
      </footer>
    </div>
  );
};

export default App;
