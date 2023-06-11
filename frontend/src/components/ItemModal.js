import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const handleAddToCart = (item) => {
    const cartItem = {
        id: item._id.$oid,
        title: item.title,
        price: item.on_sale ? item.sale_price.toFixed(2) : item.price.toFixed(2),
    };
    console.log(cartItem);
    const existingItems = JSON.parse(localStorage.getItem('cart')) || [];
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
    localStorage.setItem('cart', JSON.stringify(existingItems));
};

function ItemModal({ isOpen, onClose, item }) {
    const [isOutsideClicked, setIsOutsideClicked] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const existingItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(existingItems);
    }, []);

    const handleClose = useCallback(() => {
        setIsOutsideClicked(false);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen && isOutsideClicked) {
            handleClose();
        }
    }, [isOpen, isOutsideClicked, handleClose]);

    return (
        <>
            {isOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div
                                className="absolute inset-0 bg-gray-500 opacity-75"
                                onClick={() => {
                                    setIsOutsideClicked(true);
                                }}
                            />
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-headline"
                        >
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    {item.title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 pt-2 pr-2">
                                <button onClick={onClose} type="button" className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    type="button"
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${cartItems.some((cartItem) => cartItem.id === item._id.$oid)
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                        } text-base font-medium focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
                                >
                                    {cartItems.some((cartItem) => cartItem.id === item._id.$oid) ? 'Remove' : 'Add'}
                                </button>
                                <button
                                    onClick={onClose}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ItemModal;
