import random

import requests
from faker import Faker

fake = Faker()


def add_random_products():
    ITENS_NUMBER = 20
    API = f'https://fakestoreapi.com/products?limit={ITENS_NUMBER}'
    products = requests.get(API).json()
    for _ in range(ITENS_NUMBER):
        name = products[_]['title']
        price = round(random.uniform(1, 100), 2)
        sale_price = round(price * random.uniform(0.8, 0.95), 2)
        on_sale = random.choice([True, False])
        description = products[_]['description']
        image = products[_]['image']
        category = products[_]['category']
        quantity = random.randint(0, 100)
        rating = round(random.uniform(1, 5), 1)
        reviews = random.randint(0, 100)

        data = {
            'name': name,
            'price': price,
            'sale_price': sale_price,
            'on_sale': on_sale,
            'description': description,
            'image': image,
            'category': category,
            'quantity': quantity,
            'rating': rating,
            'reviews': reviews
        }

        response = requests.post('http://localhost:5000/products', json=data)


if __name__ == '__main__':
    add_random_products()
