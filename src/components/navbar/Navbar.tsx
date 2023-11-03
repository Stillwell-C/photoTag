import { Link, useLocation } from "react-router-dom";
import waldoSide from "../../assets/waldo-side.png";

const Navbar = () => {
  const location = useLocation();

  const gameDisplay = location.pathname.includes("/map/");

  return (
    <header
      className={`h-10 min-h-full bg-stone-300/30 items-center justify-between w-full mb-4 md:mb-8 md:h-12 ${
        gameDisplay ? "hidden lg:flex" : "flex"
      }`}
    >
      <div className='flex h-full items-center'>
        <img
          src={waldoSide}
          className='h-10 md:h-12 -scale-x-100'
          alt=''
          aria-hidden='true'
        />
        <h1 className='text-3xl -ml-2'>Phototag</h1>
      </div>
      <nav>
        <Link
          className=' mr-3 text-dec no-underline text-xl  text-black dark:text-neutral-50 hover:opacity-80'
          to='/'
        >
          Home
        </Link>
        <Link
          className=' mr-3 text-dec no-underline text-xl text-black dark:text-neutral-50  hover:opacity-80'
          to='/leaderboards'
        >
          Leaderboards
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
