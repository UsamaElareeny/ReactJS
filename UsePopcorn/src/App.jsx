import { useEffect, useState } from "react";

const average = (arr) =>
  arr.length ? arr.reduce((acc, cur) => acc + cur, 0) / arr.length : 0;

const KEY = "3fd8887e";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, SetSelectedId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function getMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data = await res.json();
        if (data.Response === "False") throw new Error(data.Error);

        if (isActive) setMovies(data.Search);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted)");
          return;
        }
        console.error("Fetching movies failed:", err.message);
        if (isActive) {
          setError(err.message || "No Movies Found!");
          setMovies([]);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    if (query.trim() !== "") {
      getMovies();
    } else {
      setMovies([]);
      setIsLoading(false);
    }

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [query]);

  function addingWatchedMovie(movie) {
    setWatched((prev) => [...prev, movie]);
  }

  function deletingWatchedMovie(movieID) {
    setWatched((prev) => prev.filter((m) => m.imdbID !== movieID));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <SearchResult movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {query === "" && <Error message={"Search For A Movie...."} />}
          {error && query !== "" && <Error message={`❌: ${error}`} />}
          {!isLoading && !error && (
            <MovieList movies={movies} setSelectedMovie={SetSelectedId} />
          )}
        </Box>

        <Box>
          {selectedId === null ? (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleting={deletingWatchedMovie}
              />
            </>
          ) : (
            <SelectedMovie
              selectedId={selectedId}
              SetSelectedId={SetSelectedId}
              handleAddingWatchedMovie={addingWatchedMovie}
            />
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function Error({ message }) {
  return <p className="error">{message}</p>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function SearchResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((o) => !o)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, setSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          setSelectedMovie={setSelectedMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, setSelectedMovie }) {
  return (
    <li onClick={() => setSelectedMovie(movie.imdbID)}>
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.jpg"}
        alt={`${movie.Title} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => Number(movie.imdbRating) || 0)
  );
  const avgUserRating = average(
    watched.map((movie) => Number(movie.userRating) || 0)
  );
  const avgRuntime = average(
    watched.map((movie) => Number(movie.Runtime) || 0)
  );

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(1)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onDeleting }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleting={onDeleting}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleting }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.Runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDeleting(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function SelectedMovie({
  selectedId,
  SetSelectedId,
  handleAddingWatchedMovie,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState({});

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function getMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (isActive) setMovie(data);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    if (selectedId) getMovieDetails();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return () => {
      document.title = `usePopcorn`;
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={() => SetSelectedId(null)}>
              &larr;
            </button>
            <img
              src={poster !== "N/A" ? poster : "/placeholder.jpg"}
              alt={`Poster of ${title}`}
            />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                <span>{imdbRating} IMDb Rating</span>
              </p>
            </div>
          </header>
          <section>
            <button
              className="btn-add"
              onClick={() =>
                handleAddingWatchedMovie({
                  ...movie,
                  Runtime: Number(runtime?.split(" ")[0]) || 0,
                })
              }
            >
              + Add to the List
            </button>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
