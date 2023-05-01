import { useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const navLinks = [
    { id: 1, label: "Home", path: "/" },
    { id: 2, label: "Ofertas do dia", path: "/sales" },
];

const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="h-full flex flex-col">
            <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <span className="font-semibold text-xl tracking-tight">My Store</span>
                </div>
                <div className="block lg:hidden">
                    <button
                        onClick={toggleMenu}
                        className="flex items-center py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white"
                    >
                        <svg
                            className="fill-current h-3 w-3"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>Menu</title>
                            <path
                                d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"
                            />
                        </svg>
                    </button>
                </div>
                <div
                    className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"
                        }`}
                >
                    <div className="text-sm lg:flex-grow">
                        {navLinks.map((link) => (
                            <Link
                                key={link.id}
                                to={link.path}
                                className="block mt-4 lg:inline-block font-semibold lg:mt-0 text-gray-200 hover:text-white mr-4"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex">
                        <div className="relative">
                            <input
                                type="text"
                                className="bg-gray-700 text-gray-200 rounded-full py-2 pr-4 pl-10 w-64 focus:outline-none focus:bg-gray-600"
                                placeholder="Pesquisar"
                            />
                            <div className="absolute top-1 left-0 pl-4 py-2">
                                <FaSearch className="text-gray-400" />
                            </div>
                        </div>
                        <div class="flex items-center ml-4">
                            <Link to="/cart" class="relative inline-block">
                                <FaShoppingCart className="text-gray-200" />
                                <span class="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{cartItems.length}</span>
                            </Link>
                        </div>

                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
