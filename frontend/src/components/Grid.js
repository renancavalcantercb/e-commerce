import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateItems } from '../utils/store';

const itemsPerPage = 8;
const itemsPerPageMobile = 4;

const localStorage = window.localStorage;

const handleAddToCart = (item) => {
    const cartItem = {
        id: item._id.$oid,
        title: item.title,
        price: item.on_sale ? item.sale_price.toFixed(2) : item.price.toFixed(2),
    };
    console.log(cartItem)
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
    const dispatch = useDispatch();
    const items = useSelector((state) => state);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (location.pathname === '/sales') {
            setCurrentPage(1);
        }
    }, [location.pathname]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/products?page=${currentPage}`);
                const data = await response.json();
                dispatch(updateItems(data));
            } catch (error) {
                console.error('Erro ao buscar os produtos:', error);
            }
        };

        fetchItems();
    }, [currentPage, dispatch]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const filteredItems = location.pathname === '/sales' ? items.filter((item) => item.on_sale) : items;
    const indexOfLastItem =
        currentPage * (window.innerWidth < 640 ? itemsPerPageMobile : itemsPerPage);
    const indexOfFirstItem = indexOfLastItem - (window.innerWidth < 640 ? itemsPerPageMobile : itemsPerPage);
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredItems.length / (window.innerWidth < 640 ? itemsPerPageMobile : itemsPerPage));

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
                {currentItems.map((item) => (
                    <div key={item._id.$oid} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                        <div className="flex-grow p-4 flex flex-col justify-between hover:bg-gray-100 cursor-pointer">
                            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-600 mb-4">{item.description}</p>
                            </div>
                            <div className="mt-auto">
                                <div>
                                    {item.on_sale ? (
                                        <div className="flex items-center">
                                            <span className="text-lg font-bold mr-2">${item.sale_price.toFixed(2)}</span>
                                            <span className="text-gray-400 line-through">${item.price.toFixed(2)}</span>
                                        </div>
                                    ) : (
                                        <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                                    )}
                                </div>
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
