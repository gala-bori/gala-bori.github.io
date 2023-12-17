import { Button } from 'reactstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

const columnDefs = [ //Define columns for ag Grid Table
    { headerName: 'Role', field: 'category' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Characters', field: 'characters', cellRenderer: ({ value }) => value.join(', ') },
];

export default function Movie() {
    const [movie, setMovie] = useState({});
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const imdb = searchParams.get("imdbID");
    const url = `http://sefdb02.qut.edu.au:3000/movies/data/${imdb}`;

    const gridApiRef = useRef(null);

    useEffect(() => {//Get Movie data and handle any errors
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
            .then(data => {
                setMovie(data);
            })
            .catch((error) => {
                alert(error.message);
                console.log(error); //Display/log any errors
            });
    }, [imdb, url]);

    const formatBoxOffice = (value) => { //Formats returned boxoffice value to currency
        return value.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
        });
    };

    const formatRating = (source, value) => { //Formats returned rating to % etc
        if (source === "Internet Movie Database") {
            return `${value}/10`;
        } else if (source === "Rotten Tomatoes") {
            return `${value}%`;
        } else if (source === "Metacritic") {
            return `${value}/100`;
        } else {
            return value;
        }
    };

    return ( //Renders Ag Grid table, back button, HTML/Image
        <div className='home-container'>
            <h2>{movie.title} ({movie.year})</h2>
            <img src={movie.poster} alt={`${movie.title} Poster`} />
            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
            <p><strong>Genres:</strong> {movie.genres && movie.genres.join(", ")}</p>
            <p><strong>Country:</strong> {movie.country}</p>
            <p><strong>Box Office:</strong> {movie.boxoffice ? formatBoxOffice(movie.boxoffice) : "N/A"}</p>
            <p>{movie.plot}</p>
            <p><strong>Ratings:</strong></p>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {movie.ratings && movie.ratings.map((rating, index) => (
                    <li key={index}><strong>{rating.source}:</strong> {formatRating(rating.source, rating.value)}</li>
                ))}
            </ul>
            <Button
                color="info"
                size="sm"
                className="mt-3"
                onClick={() => navigate("/movies")}
            >
                Back
            </Button>
            <h3>Click on a person to get more information about their movies!</h3>

            <div className="ag-theme-alpine" style={{ margin: '0 auto', maxWidth: '700px' }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={movie.principals}
                    rowHeight={45}
                    headerHeight={40}
                    domLayout="autoHeight"
                    onRowClicked={row => navigate(`/Actor?ID=${row.data.id}`)} //Sets URl so that it can be grabbed
                    onGridReady={params => {
                        gridApiRef.current = params;
                    }}
                />
            </div>
        </div>
    );
}

