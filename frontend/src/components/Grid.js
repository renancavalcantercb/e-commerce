import React, { useState } from 'react';
import { generateItems } from '../utils/utils';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const itemsPerPage = 8;
const itemsPerPageMobile = 4;

const items = generateItems(20);

const localStorage = window.localStorage;

const handleAddToCart = (item) => {
    const cartItem = {
        id: item.id,
        title: item.title,
        price: item.discount ? item.discount.toFixed(2) : item.price.toFixed(2),
    };
    const existingItems = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = existingItems.findIndex((item) => item.id === cartItem.id);

    if (existingItemIndex !== -1) {
        existingItems.splice(existingItemIndex, 1);

        const alertMessage = `O item "${cartItem.title}" já está no carrinho e foi removido.`;
        toast.warn(alertMessage);
    } else {
        existingItems.push(cartItem);

        const alertMessage = `O item "${cartItem.title}" foi adicionado ao carrinho.`;
        toast.success(alertMessage);
    }
    localStorage.setItem("cart", JSON.stringify(existingItems));
};


function Grid() {
    const location = useLocation();

    const filteredItems = location.pathname === '/sales' ? items.filter((item) => item.sale) : items.filter((item) => !item.discount);
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem =
        currentPage * (window.innerWidth < 640 ? itemsPerPageMobile : itemsPerPage);
    const indexOfFirstItem = indexOfLastItem - (window.innerWidth < 640 ? itemsPerPageMobile : itemsPerPage);
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredItems.length / (window.innerWidth < 640 ? itemsPerPageMobile : itemsPerPage));

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
                {currentItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600 mb-4">{item.description}</p>
                            <div className="flex justify-between items-center">
                                {item.discount ? (
                                    <div className="flex items-center">
                                        <span className="text-lg font-bold mr-2">${item.discount.toFixed(2)}</span>
                                        <span className="text-gray-400 line-through">${item.price.toFixed(2)}</span>
                                    </div>
                                ) : (
                                    <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                                )}
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => handleAddToCart(item)
                                    }
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`px-3 py-1 rounded-full ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Grid;
