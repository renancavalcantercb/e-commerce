from application import app, db
from bson import json_util
from flask import request, jsonify, make_response


@app.route('/api')
def index():
    return jsonify({'message': 'Welcome to the API!', 'status': 200})


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
            return jsonify({'message': 'Product successfully created!', 'status': 201})
        except Exception as e:
            return jsonify({'message': 'Error creating product: ' + str(e), 'status': 500})

    return jsonify({'message': 'Invalid request method', 'status': 400})


@app.route('/api/register', methods=['POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        cpf = data.get('cpf')
        birth_date = data.get('birth_date')
        phone = data.get('phone')
        admin = data.get('admin', False)

        if not name or not email or not password or not cpf or not birth_date or not phone:
            return jsonify({'message': 'Missing fields', 'status': 400})

        existing_user = db.users.find_one({'$or': [{'email': email}, {'cpf': cpf}]})
        if existing_user:
            return jsonify({'message': 'Email or CPF already exists', 'status': 400})

        try:
            db.users.insert_one({
                'name': name,
                'email': email,
                'password': password,
                'cpf': cpf,
                'birth_date': birth_date,
                'phone': phone,
                'admin': admin
            })
            return jsonify({'message': 'User successfully created!', 'status': 201})
        except Exception as e:
            return jsonify({'message': 'Error creating user: ' + str(e), 'status': 500})
    
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    return jsonify({'error': 'Invalid request method', 'status': 400})
    