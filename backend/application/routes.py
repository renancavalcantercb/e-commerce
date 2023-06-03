from application import app, db
from bson import json_util
from flask import request, jsonify


@app.route('/api')
def index():
    return 'Hello World!'


@app.route('/api/products', methods=['GET', 'POST'])
def products(size: int = 10, page: int = 1):
    if request.method == 'GET':
        size = int(request.args.get('size', 10))
        page = int(request.args.get('page', 1))

        offset = (page - 1) * size

        products = db.products.find().skip(offset).limit(size)
        return json_util.dumps(products)

    elif request.method == 'POST':
        data = request.get_json()

        title = data.get('name')
        price = data.get('price')
        sale_price = data.get('sale_price')
        on_sale = data.get('on_sale')
        description = data.get('description')
        image = data.get('image')
        category = data.get('category')
        quantity = data.get('quantity')
        rating = data.get('rating')
        reviews = data.get('reviews')

        try:
            db.products.insert_one({
                'title': title,
                'price': price,
                'sale_price': sale_price,
                'on_sale': on_sale,
                'description': description,
                'image': image,
                'category': category,
                'quantity': quantity,
                'rating': rating,
                'reviews': reviews
            })
            return jsonify({'message': 'Product successfully created!'})
        except Exception as e:
            return jsonify({'error': 'Error creating product: ' + str(e)})

    return jsonify({'error': 'Invalid request method'})
