import React, { useState, useEffect } from 'react';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCartItems);
        calculateTotalPrice(storedCartItems);
    }, []);

    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, currentItem) => {
            return acc + parseFloat(currentItem.price);
        }, 0);
        setTotalPrice(total.toFixed(2));
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Carrinho</h2>
            {cartItems.length === 0 ? (
                <p className="text-gray-600">Seu carrinho está vazio.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <span className="text-lg font-bold">${item.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end items-center mt-4">
                        <span className="text-xl font-bold mr-2">Total: ${totalPrice}</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;