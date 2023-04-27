function generateItems(numItems) {
    const items = [];

    for (let i = 1; i <= numItems; i++) {
        const item = {
            id: i,
            title: `Item ${i}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            price: Math.floor(Math.random() * 100) + 1,
            image: 'https://via.placeholder.com/150',
        };

        items.push(item);
    }

    return items;
}

export { generateItems };