import { Popover } from '@headlessui/react'
import { Bars3Icon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import SearchBar from './SearchBar.js'
import { Link } from 'react-router-dom'

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

export default function NavBar() {
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
                                            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                                        >
                                            {page.name}
                                        </Link>
                                    ))}
                                </div>
                            </Popover.Group>

                            <div className="ml-auto flex items-center">
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                    {navigation.auth.map((authItem) => (
                                        <Link
                                            key={authItem.name}
                                            to={authItem.href}
                                            className="text-sm font-medium text-gray-700 hover:text-gray-800"
                                        >
                                            {authItem.name}
                                        </Link>
                                    ))}
                                </div>

                                {SearchBar()}

                                <div className="ml-4 flow-root lg:ml-6">
                                    <Link to="/cart">
                                        <button className="group -m-2 flex items-center p-2">
                                            <ShoppingBagIcon
                                                className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                aria-hidden="true"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{cartItems.length}</span>
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
