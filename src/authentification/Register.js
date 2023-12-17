import { useState } from "react";

const API_URL = `http://sefdb02.qut.edu.au:3000`;

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = () => {
    const url = `${API_URL}/user/register`;

    return fetch(url, { //Function to POST email/password and register account if appropriate
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.status === 201) {
          return res.json().then(() => {
            alert("User account created, please Login!");
            window.location.replace("./login"); // redirect to the login page
          });
        } else if (res.status === 400) {
          throw new Error("Both email and password are required");
        } else if (res.status === 409) {
          throw new Error("User already exists");
        } else if (res.status === 429) {
          throw new Error("Too many requests, please try again later.");
        } else {
          throw new Error("Registration failed");
        }
      }).then(() => { 
      })
      .catch((error) => {
        alert(error.message); //Alert/log any other errors...
        console.log(error);
      });
  };

  const handleEmailChange = (x) => { //Functions to set data when requested by submission below
    setEmail(x.target.value);
  };

  const handlePasswordChange = (x) => {
    setPassword(x.target.value);
  };

  const handleSubmit = (x) => {
    x.preventDefault();
    register();
  };

  return ( //Renders two input forms and submit button
    <div className="App">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          className="form-control custom-input"
          style={{ width: "300px" }} 
        />
        <label><br />Password:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="form-control custom-input"
          style={{ width: "300px" }}
        />
        <br />
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

export default Register;
