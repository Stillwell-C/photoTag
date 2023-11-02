import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className=' h-10 min-h-full bg-stone-300/30 flex items-center justify-end w-full md:mb-8 md:h-12'>
      <div>
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
      </div>
    </nav>
  );
};

export default Navbar;
