import SearchItem from "./SearchItem";
import Login from "./Login";

const Navbar = () => {
  return (
    <nav className="top-0 z-20 flex h-[60px] items-center justify-between bg-white px-4 py-4 shadow-lg sm:px-8 md:px-16 lg:px-32">
      <a href="/home" className="pl-4 text-3xl font-bold sm:pl-0 sm:text-4xl">
        <span className="font-oswald text-black">6P'S</span>
        <span className="font-oswald text-[#c63402]"> Cousine</span>
      </a>
      <div className="flex items-center space-x-4">
        <SearchItem />
        <Login />
      </div>
    </nav>
  );
};

export default Navbar;
