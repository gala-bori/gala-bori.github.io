import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { Button } from 'reactstrap';
import Chart from './Chart';

function Actor() {
  const [actor, setActor] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const personId = searchParams.get("ID"); //Get the actorID from the URL
  const url = `http://sefdb02.qut.edu.au:3000/people/${personId}`;
  const bearerToken = localStorage.getItem("token"); // get the token from localStorage

  useEffect(() => { //Sends token to allow authorisation and attempts to return actor data
    fetch(url, {
      headers: {
        "Authorization": `Bearer ${bearerToken}`,
        "accept": "application/json"
      }
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          throw new Error("Invalid query parameters");
        } else if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status === 404) {
          throw new Error("Requested actor cannot be found");
        } else if (response.status === 429) {
          throw new Error("Rate limit exceeded");
        } else {
          throw new Error("Unknown error occurred");
        }
      })
      .then(data => {
        setActor(data);
      })
      .catch(error => {
        console.error(error);
        alert(error.message); // display window alert for any error
      });
  }, [url, bearerToken]);

  const columns = [ //Define columns for Ag Grid Table
    { headerName: "Role", field: "category", sortable: true, width: "flex" },
    { headerName: "Movie Name", field: "movieName", sortable: true, width: 300 },
    { headerName: "Characters", field: "characters", sortable: true },
    { headerName: "IMDb Rating", field: "imdbRating", sortable: true }
  ];

  const rowData = actor.roles ? actor.roles.map(role => ({ //Map returned data to table
    movieId: role.movieId,
    movieName: role.movieName,
    category: role.category || "N/A",
    imdbRating: role.imdbRating || "N/A",
    characters: role.characters.join(", ") || "N/A"
  })) : [];

    return ( //Renders Ag Grid table and static boxplot image and back button
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
      <h2>{actor.name}</h2>
      <p>{actor.birthYear || "N/A"}—{actor.deathYear || "—"}</p>
      <p>Select a movie...</p>

      <div
        className="ag-theme-balham"
        style={{ width: "900px", overflow: "hidden" }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          rowHeight={25}
          headerHeight={40}
          domLayout="autoHeight"
          onRowClicked={row => navigate(`/Movie?imdbID=${row.data.movieId}`)}
          suppressHorizontalScroll={true}
          suppressBrowserResizeObserver={true}
        />
      </div>
      <Chart ratings={actor.roles?.map(role => role.imdbRating) || []} personName={actor.name} />
      <Button
        color="info"
        size="sm"
        className="mt-3"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </div>
  );
}

export default Actor;