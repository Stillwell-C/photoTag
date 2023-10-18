import { Link } from "react-router-dom";
import "./navbar.scss";

const Navbar = () => {
  return (
    <div className='navbar-container'>
      <div className='links'>
        <Link to='/'>Home</Link>
        <Link to='/leaderboards'>Leaderboards</Link>
      </div>
    </div>
  );
};

export default Navbar;
