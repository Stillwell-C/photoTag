import { Link } from "react-router-dom";
import "./navbar.scss";

const Navbar = () => {
  return (
    <nav className='navbar-container'>
      <div className='links'>
        <Link to='/'>Home</Link>
        <Link to='/leaderboards'>Leaderboards</Link>
      </div>
    </nav>
  );
};

export default Navbar;
