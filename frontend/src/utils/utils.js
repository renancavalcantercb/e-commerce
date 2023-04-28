function generateItems(numItems) {
    const items = [];

    for (let i = 1; i <= numItems; i++) {
        const hasDiscount = Math.random() > 0.5;
        const item = {
            id: i,
            title: `Item ${i}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            price: Math.floor(Math.random() * 100) + 1,
            sale: hasDiscount,
            discount: hasDiscount ? Math.floor(Math.random() * 50) + 1 : 0,
            hasDiscount: hasDiscount,
            image: 'https://via.placeholder.com/150',
        };

        items.push(item);
    }

    return items;
}


export { generateItems };
