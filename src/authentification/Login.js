import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

const API_URL = `http://sefdb02.qut.edu.au:3000`;

function Login({ handleLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSuccessfulLogin = () => {
    alert(`Welcome ${email}!`);
    handleLogin(); // updates the isLoggedIn state in app.js
    const currentPath = window.location.pathname;

    if (currentPath === "/login") {// Navigate to movies page IFF loggin in from login page otherwise login (success) > actor page
      navigate("/movies");
    }
  };

  const handleEmailChange = (x) => { //Functions to set data when requested by input forms below
    setEmail(x.target.value);
  };

  const handlePasswordChange = (x) => {
    setPassword(x.target.value);
  };

  const handleSubmit = (x) => { //Function to POST email/password to API and handle return tokens/errors
    x.preventDefault();

    const url = `${API_URL}/user/login`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 400) {
          throw new Error("Both email and password are required");
        } else if (res.status === 401) {
          throw new Error("Incorrect email or password");
        } else if (res.status === 429) {
          throw new Error("Too many requests, please try again later.");
        } else {
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        const bearerToken = data.bearerToken.token; 
        const refreshToken = data.refreshToken.token; 
        localStorage.setItem("email", email); 
        localStorage.setItem("token", bearerToken); 
        localStorage.setItem("refreshToken", refreshToken); 

        handleSuccessfulLogin(); //Calls above function and redirects to appropriate page

      })
      .catch((error) => {
        alert(error.message);
        console.log(error); //Display/log any errors
      });
  };

  return ( //Renders two input forms and submit button
    <div className="App">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="form-control custom-input"
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="form-control custom-input"
          />
        </label>
        <br />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default Login;


