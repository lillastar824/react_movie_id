import React from "react";
import { Collapse, Checkbox } from "antd";
import style from "./MoviesList.module.css";

const { Panel } = Collapse;

export default function UnwatchList({ data, handleChange }) {
  function onChange(e) {}
  return (
    <div>
      <Collapse defaultActiveKey={["1"]} ghost>
        {data.map((movie) => (
          <Panel header={movie.original_title} key={movie.id}>
            <div className="d-flex align-items-center">
              <div className="mr-3">
                <i className="fas fa-image fa-5x"></i>
              </div>
              <div className={`${style.movieDetail} d-block d-md-flex`}>
                <div>
                  <p className="mb-0">Year: {movie.release_date}</p>
                  <p className="mb-0">Runtime: 128</p>
                  <p className="mb-0">IMDB Score: {movie.vote_average}</p>
                </div>
                <Checkbox
                  checked={movie.watched}
                  onChange={(e) => handleChange(movie.id, e.target.checked)}
                >
                  Watched
                </Checkbox>
              </div>
            </div>
            {/* <div className="form-group form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={"moviebox_" + movie.id}
                value={movie.id}
                onChange={this.addWatchlistCheck}
              />
              <label
                className="form-check-label"
                htmlFor={"moviebox_" + movie.id}
              >
                Watched
              </label>
            </div> */}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
}
