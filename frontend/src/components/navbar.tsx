import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import { Link } from "react-router-dom";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const openMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (
        <>
            <div className="bg-[#373b69] px-5 py-2 flex flex-row justify-between items-center sm:px-8">
                <p className="text-2xl font-bold text-white">KidsFlix</p>

                <div className="hidden px-5 py-1 w-2/5 sm:flex flex-row justify-between items-center gap-5 font-sm text-white italic">
                    <a>
                        <Link className="hover:font-bold" to="/">
                            Home
                        </Link>
                    </a>
                    <a>
                        <Link className="hover:font-bold" to="/favourites">
                            Favourites
                        </Link>
                    </a>
                    <a>
                        <Link to="/login">
                            <button className="bg-red-400 px-4 py-1 w-fit rounded-sm hover:bg-red-600 hover:font-bold">
                                Login
                            </button>
                        </Link>
                    </a>
                </div>
                <button className="sm:hidden">
                    <FontAwesomeIcon
                        icon={faBars}
                        className="text-white text-xl"
                        onClick={openMenu}
                    />
                </button>
            </div>
            <div
                className={`bg-slate-300 flex flex-col pl-8 py-4 ${
                    menuOpen ? "block" : "hidden"
                }`}>
                <Link className="py-1 hover:font-bold w-[80%]" to="/">
                    Home
                </Link>
                <Link className="py-1 hover:font-bold w-[80%]" to="/favourites">
                    Favourites
                </Link>
                <Link to="/login">
                    <button className="bg-red-400 px-4 py-1 mt-1 mb-5 w-fit rounded-sm hover:bg-red-600 hover:font-bold">
                        Login
                    </button>
                </Link>
            </div>
        </>
    );
};

export default Navbar;
