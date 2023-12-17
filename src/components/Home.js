import image from './movie.jpg';
import '../App.css';
import { Link } from 'react-router-dom';

function Home({ isLoggedIn }) {

  return ( //Renders simple HTML and login link
    <div className="home-container">
      <h1>Gala Bori's Simple Movie Searching Website</h1>
      <img src={image} alt="" width="500" />
      {!isLoggedIn ? ( //Dispaly Login link IFF user not logged in
        <h2>Please <Link to="/login">Login</Link> to gain information for Movie Actors!</h2>
      ) : null}
    </div>
  );
}

export default Home;