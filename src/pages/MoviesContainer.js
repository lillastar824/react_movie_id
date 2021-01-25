import React, { useState } from "react";
import { AutoComplete, Button, Tabs, Input } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import MoviesList from "../components/MoviesList";
import "antd/dist/antd.css";
import "./moviesContainer.css";

const { TabPane } = Tabs;

export default function MoviesContainer() {
  const [movieList, setMovieList] = useState();
  const [movies, setMovies] = useState([]);
  const [activeMovie, setActiveMovie] = useState();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    const movies = localStorage.getItem("movies");
    if (movies) setMovies(JSON.parse(movies));
    return () => {};
  }, []);

  const onSearch = (searchText) => {
    if (!loading && searchText) {
      setLoading(true);
      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=6746f6929012b85e6d698792f3496740&query=${searchText}&language=en-US`
      )
        .then((results) => results.json())
        .then((data) => {
          setMovieList(data.results);
          const Movies = data.results.map((movie) => {
            return {
              value: movie.original_title,
            };
          });

          setOptions(Movies);
          setLoading(false);
        });
    }
  };

  const onSelect = (data) => {
    setActiveMovie(data);
  };
  const onAdd = () => {
    movieList.map((movie) => {
      if (movie.original_title == activeMovie)
        setMovies([{ ...movie, watched: false }, ...movies]);
      {
        localStorage.setItem(
          "movies",
          JSON.stringify([{ ...movie, watched: false }, ...movies])
        );
      }
    });
  };
  const HandleChange = (id, checked) => {
    const newArray = movies.map((movie) =>
      movie.id == id
        ? {
            ...movie,
            watched: checked,
          }
        : movie
    );
    localStorage.setItem("movies", JSON.stringify(newArray));
    setMovies(newArray);
  };
  const searchMovies = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div>
      <AutoComplete
        options={options}
        style={{
          width: "100%",
          maxWidth: "300px",
          marginRight: "1em",
        }}
        onSelect={onSelect}
        onSearch={onSearch}
        placeholder="Search MovieDB"
        className="mb-2 mb-md-0"
      />
      <Button type="primary" className="mb-2 mb-md-0" onClick={onAdd}>
        Add to movies
      </Button>
      <div className="d-flex flex-column mt-4">
        <Input
          style={{ width: "100%", maxWidth: "200px", alignSelf: "flex-end" }}
          onChange={searchMovies}
          className="movieSearch"
          placeholder="Search My Movies"
        />
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span className="d-flex flex-column align-items-center">
                <EyeInvisibleOutlined />
                movies
              </span>
            }
            key="1"
          >
            {movies.length > 0 ? (
              <MoviesList
                handleChange={HandleChange}
                data={movies.filter(
                  (movie) =>
                    !movie.watched &&
                    movie.original_title.toLowerCase().includes(searchTerm)
                )}
              />
            ) : (
              <p>Unwatched not available ...!</p>
            )}
          </TabPane>
          <TabPane
            tab={
              <span className="d-flex flex-column align-items-center">
                <EyeOutlined />
                Watched
              </span>
            }
            key="2"
          >
            {movies.length > 0 ? (
              <MoviesList
                handleChange={HandleChange}
                data={movies.filter(
                  (movie) =>
                    movie.watched &&
                    movie.original_title.toLowerCase().includes(searchTerm)
                )}
              />
            ) : (
              <p>watched not available ...!</p>
            )}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
