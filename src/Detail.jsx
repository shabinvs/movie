import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Detail = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setImageLoaded(false); // reset image loading on id change
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?i=${id}&apikey=a5ef1268`
        );
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch movie details", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return (
    <div
      className="min-h-screen select-none p-6 flex flex-col  justify-center items-center md:flex-row relative overflow-hidden"
      style={{
        background:
          "linear-gradient(270deg, #1e3c72, #2a5298, #1e3c72, #2a5298)",
        backgroundSize: "800% 800%",
        animation: "gradientAnimation 20s ease infinite",
      }}
    >
      {/* Abstract blurred blobs */}
      <div className="absolute top-[-150px] left-[-100px] w-[300px] h-[300px] bg-purple-700 rounded-full opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-[200px] right-[-100px] w-[350px] h-[350px] bg-cyan-400 rounded-full opacity-20 blur-2xl animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-[-150px] left-[50%] translate-x-[-50%] w-[400px] h-[400px] bg-pink-500 rounded-full opacity-25 blur-3xl animate-blob animation-delay-6000"></div>

      <div
        className="relative flex flex-col md:flex-row justify-center items-center gap-10 rounded-xl shadow-lg z-10 p-6 w-full max-w-[900px] md:w-[900px] min-h-[450px] md:h-[450px] overflow-y-auto"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        {/* Image Skeleton & Image */}
        <div className="relative w-full max-w-[240px] h-[360px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-lg" />
          )}
          {!loading && (
            <img
              src={data.Poster}
              alt="thumbnail"
              className={`rounded-lg max-w-full object-cover transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          )}
        </div>

        {/* Content Skeleton & Content */}
        <div className="px-4 md:px-10 py-8 font-mono w-full max-w-xl text-gray-900">
          {/* Title */}
          {loading ? (
            <div className="h-10 bg-gray-300 rounded-md animate-pulse w-3/4 mb-4" />
          ) : (
            <h1 className="font-bold text-3xl font-serif mb-2 drop-shadow-md">
              Movie: {data.Title}
            </h1>
          )}

          {/* Rating (static stars) */}
          {loading ? (
            <div className="h-6 bg-gray-300 rounded-md animate-pulse w-1/4 mb-4" />
          ) : (
            <h1 className="mb-2 drop-shadow-md">⭐⭐⭐⭐⭐</h1>
          )}

          {/* Plot */}
          {loading ? (
            <>
              <div className="h-4 bg-gray-300 rounded-md animate-pulse w-full mb-2" />
              <div className="h-4 bg-gray-300 rounded-md animate-pulse w-full mb-2" />
              <div className="h-4 bg-gray-300 rounded-md animate-pulse w-5/6 mb-6" />
            </>
          ) : (
            <p className="drop-shadow-sm">{data.Plot}</p>
          )}

          {/* Release Date */}
          {loading ? (
            <div className="h-4 bg-gray-300 rounded-md animate-pulse w-1/3 mb-2" />
          ) : (
            <h1 className="mt-6 drop-shadow-md">Release Date: {data.Year}</h1>
          )}

          {/* Director */}
          {loading ? (
            <div className="h-4 bg-gray-300 rounded-md animate-pulse w-1/2" />
          ) : (
            <h1 className="drop-shadow-md">Director: {data.Director}</h1>
          )}
        </div>
      </div>

      {/* Gradient animation keyframes */}
      <style>{`
        @keyframes gradientAnimation {
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }
        /* Blob animation */
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
};

export default Detail;
