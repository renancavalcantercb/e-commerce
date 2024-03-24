import { Popover } from '@headlessui/react'
import { Bars3Icon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import SearchBar from './SearchBar.js'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import jwt_decode from 'jwt-decode'

const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

const navigation = {
    pages: [
        { name: 'Home', href: '/' },
        { name: 'Sales', href: '/sales' },
    ],
    auth: [
        { name: 'Sign in', href: '/login' },
        { name: 'Create account', href: '/register' },
    ]
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
    const { isLoggedIn, logout } = useAuth();
    let user_name = "";
    const location = useLocation();

    if (isLoggedIn) {
        const token = localStorage.getItem('token');
        if (token) {
            const tokenDecoded = jwt_decode(token);
            user_name = tokenDecoded.name || "";
        }
    }

    return (
        <div className="bg-white">
            <header className="relative bg-white">
                <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="border-b border-gray-200">
                        <div className="flex h-16 items-center">
                            <button
                                type="button"
                                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                            >
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>

                            <div className="ml-4 flex lg:ml-0">
                                <Link to="/">
                                    <span className="sr-only">E-commerce</span>
                                    <img
                                        className="h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                        alt=""
                                    />
                                </Link>
                            </div>

                            <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                                <div className="flex h-full space-x-8">
                                    {navigation.pages.map((page) => (
                                        <Link
                                            key={page.name}
                                            to={page.href}
                                            className={classNames(
                                                "flex items-center text-sm hover:text-gray-800",
                                                location.pathname === page.href ? "text-[#5046e6]" : "text-gray-700"
                                            )}
                                            style={{ fontSize: '1rem' }}
                                        >
                                            {page.name}
                                        </Link>
                                    ))}
                                </div>
                            </Popover.Group>

                            <div className="ml-auto flex items-center">
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                    {isLoggedIn ? (
                                        <Menu as="div" className="relative inline-block text-left">
                                            <div>
                                                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md text-sm text-gray-700 hover:text-gray-800" style={{ fontSize: '1rem' }}>
                                                    Hello, {user_name}
                                                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                </Menu.Button>
                                            </div>

                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <div className="py-1">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link to="/profile">
                                                                    <button
                                                                        type="submit"
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                            'block w-full px-4 py-2 text-left text-sm'
                                                                        )}
                                                                    >
                                                                        Profile
                                                                    </button>
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>

                                                            {({ active }) => (

                                                                <button
                                                                    type="submit"
                                                                    className={classNames(
                                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                        'block w-full px-4 py-2 text-left text-sm'
                                                                    )}
                                                                    onClick={logout}
                                                                >
                                                                    Sign out
                                                                </button>

                                                            )}

                                                        </Menu.Item>
                                                    </div>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    ) : (
                                        navigation.auth.map((authItem) => (
                                            <Link
                                                key={authItem.name}
                                                to={authItem.href}
                                                className={classNames(
                                                    "text-sm hover:text-gray-800",
                                                    location.pathname === authItem.href ? "text-[#5046e6]" : "text-gray-700"
                                                )}
                                                style={{ fontSize: '1rem' }}
                                            >
                                                {authItem.name}
                                            </Link>
                                        ))
                                    )}
                                </div>

                                {SearchBar()}

                                <div className="ml-4 flow-root lg:ml-6">
                                    <Link to="/cart">
                                        <button className="group -m-2 flex items-center p-2">
                                            <ShoppingBagIcon
                                                className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                aria-hidden="true"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-800" style={{ fontSize: '1rem' }}>{cartItems.length}</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    )
}
