import { useState, useEffect } from 'react';
import 'bootstrap';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from "ag-grid-react";

function Movies() {
  const [searchValue, setSearchValue] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();

  const columns = [ //Define columns for Ag Table
    { headerName: "Title", field: "title", sortable: true },
    { headerName: "Year", field: "year", sortable: true },
    { headerName: "IMDB Rating", field: "imdbRating", sortable: true },
    { headerName: "RottenTomatoes", field: "rottenTomatoesRating", sortable: true },
    { headerName: "Metacritic", field: "metacriticRating", sortable: true },
    { headerName: "Classification", field: "classification", sortable: true },
  ];

  useEffect(() => { //Initate GET for movie by title and or year. 
    const url = `http://sefdb02.qut.edu.au:3000/movies/search?title=${searchValue}&year=${searchYear}`;

    fetch(url)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 400) {
          throw new Error("Invalid query parameters:");
        } else if (res.status === 404) {
          throw new Error("No record exists of a movie with this ID");
        } else if (res.status === 429) {
          throw new Error("Too many requests, please try again later.");
        } else {
          throw new Error("Request failed, something is very wrong...");
        }
      })
      .then(data => data.data)
      .then(data =>
        data.map(movie => {
          return { //Assign returned value to variables
            title: movie.title,
            year: movie.year,
            classification: movie.classification,
            imdbID: movie.imdbID,
            rottenTomatoesRating: movie.rottenTomatoesRating,
            metacriticRating: movie.metacriticRating,
            imdbRating: movie.imdbRating,
          };
        }))
      .then(movies => {
        setRowData(movies);
      })
      .catch((error) => {
        alert(error.message);
        console.log(error); //Display/log any errors
      });
  }, [searchValue, searchYear])

  const rowCount = rowData.length;

  return ( //Renders two search boxes, Ag Grid table and conditional HTML
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>
        {searchYear} {searchValue}
        <input
          type="text"
          value={searchValue}
          onChange={(x) => setSearchValue(x.target.value)}
          placeholder="Enter Movie Title!"
          className="form-control custom-input"
        />
        <input
          type="number"
          value={searchYear}
          onChange={(x) => setSearchYear(x.target.value)}
          placeholder="Enter Movie Year!"
          inputMode="numeric"
          pattern="\d*"
          className="form-control custom-input"
        />
      </h1>
      <p>Select a movie...</p>
      <div
        className="ag-theme-balham"
        style={{ height: "800px", width: "100%", maxWidth: "1250px" }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          onRowClicked={row => navigate(`/Movie?imdbID=${row.data.imdbID}`)} //Change URL such that it can be grabbed
          domLayout="normal"
        />
      </div>
      {rowCount >= 100 ? ( //Display text if more then 100 results...
        <p>Displaying the first 100 Results!</p>
      ) : (
        <h3>{rowCount} Results Found!</h3>
      )}
    </div>
  );
}

export default Movies;
