import { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import 'bootstrap';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-balham.css"
import Movie from "./components/Movie";
import Login from "./authentification/Login";
import Register from "./authentification/Register";
import Actor from "./components/Actor";
import Home from "./components/Home";
import Movies from "./components/Movies";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bearerToken] = useState('');  
  const email = localStorage.getItem('email');
  const API_URL = 'http://sefdb02.qut.edu.au:3000';

  useEffect(() => { //Probably not the greatest
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const storedEmail = localStorage.getItem('email');
    if (token && refreshToken && storedEmail) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);

    setInterval(() => { //Automatically performs POST of refreshToken and updates stored tokens after 590 seconds
      const refreshToken = localStorage.getItem('refreshToken');
      const url = `${API_URL}/user/refresh`;

      fetch(url, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })
        .then((res) => res.json())
        .then((data) => { //Extract, set tokens and store tokens
          let newToken = data.bearerToken.token;
          let newRefreshToken = data.refreshToken.token;

          // setBearerToken(newToken);
          // setRefreshToken(newRefreshToken);

          localStorage.setItem('token', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 590000); // 590 seconds just in case...
  };

  const handleLogout = () => { //Removes tokens, email, stored loggedin variable and redirects user
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("email");

    const refreshToken = localStorage.getItem("refreshToken");
    const url = `${API_URL}/user/logout`;

    fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          localStorage.removeItem("refreshToken");
          alert("Successfully logged out");
          window.location.replace("./"); // redirect to the login page upon logout
        } else {
          throw new Error("Logout failed");
        }
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  };


  return ( //Highest level component which renders Home, Movies, Login, Register (Logout) button
    <div className="home-container">
      <BrowserRouter>
        <nav>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/movies">Movies</Link>
            {!isLoggedIn && ( //Display Login and Register if not logged in
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
            {isLoggedIn && ( //Display username if logged in
              <span className="user-email">{email}</span>
            )}
            {isLoggedIn && ( //Dispaly logout button if logged in
              <Button className="logout-btn" size="sm" color="info" onClick={handleLogout}>Logout</Button>
            )}
          </div>
        </nav>
        <Routes> 
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} /> 
          <Route path="/movies" element={<Movies />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login handleLogin={handleLogin} />}
          />
          <Route path="/movie" element={<Movie />} />
          <Route
            path="/actor"
            element={
              isLoggedIn ? (
                <Actor bearerToken={bearerToken} />
              ) : ( //If user logged in, route to Actor page otherwise login
                <Login handleLogin={handleLogin} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
      <div className="home-container">
        {isLoggedIn && <p>Logged in as: {email}</p>}
        <p>All data is from IMDB, Metacritic and RottenTomatoes.</p>
        <p>&copy; 2023 Gala Bori</p>
      </div>
    </div>
  );
};

export default App;


