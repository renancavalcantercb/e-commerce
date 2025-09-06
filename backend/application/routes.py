import datetime
import jwt
from application import app, db
from bson import json_util
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from application.decorators.token_decorator import token_required
from application.utils.utils import (
    clean_cpf,
    generate_confirmation_token,
    send_confirmation_email,
)
from application.validators import (
    validate_user_data,
    validate_product_data,
    validate_email,
    validate_phone,
    sanitize_string,
)


@app.route("/api")
def index():
    return jsonify({"message": "Welcome to the API!", "status": 200}), 200


@app.route("/api/products", methods=["GET", "POST"])
def products():
    if request.method == "GET":
        try:
            size = min(int(request.args.get("size", 10)), 50)  # Limit max size
            page = max(int(request.args.get("page", 1)), 1)    # Ensure page >= 1
            
            offset = (page - 1) * size
            
            products = db.products.find().skip(offset).limit(size)
            return json_util.dumps(products)
        except ValueError:
            return jsonify({"message": "Invalid pagination parameters", "status": 400}), 400
        except Exception as e:
            return jsonify({"message": "Error fetching products", "status": 500}), 500

    elif request.method == "POST":
        try:
            data = request.get_json()
            if not data:
                return jsonify({"message": "No data provided", "status": 400}), 400
            
            # Map 'name' to 'title' for backward compatibility
            if "name" in data:
                data["title"] = data.pop("name")
            
            # Validate product data
            validation_result = validate_product_data(data)
            if not validation_result["valid"]:
                return jsonify({
                    "message": "Validation errors",
                    "errors": validation_result["errors"],
                    "status": 400
                }), 400
            
            # Check if product with same title exists
            existing_product = db.products.find_one({"title": data["title"]})
            if existing_product:
                return jsonify({
                    "message": "Product with this title already exists",
                    "status": 400
                }), 400
            
            # Sanitize and prepare product data
            product_data = {
                "title": sanitize_string(data["title"]),
                "price": float(data["price"]),
                "sale_price": float(data.get("sale_price", data["price"])),
                "on_sale": bool(data.get("on_sale", False)),
                "description": sanitize_string(data["description"]),
                "image": sanitize_string(data.get("image", "")),
                "category": sanitize_string(data["category"]),
                "quantity": int(data["quantity"]),
                "rating": float(data.get("rating", 0)),
                "reviews": int(data.get("reviews", 0)),
                "created_at": datetime.datetime.utcnow(),
                "updated_at": datetime.datetime.utcnow()
            }
            
            result = db.products.insert_one(product_data)
            return jsonify({
                "message": "Product successfully created!",
                "product_id": str(result.inserted_id),
                "status": 201
            }), 201
            
        except ValueError as e:
            return jsonify({
                "message": "Invalid data format",
                "error": str(e),
                "status": 400
            }), 400
        except Exception as e:
            return jsonify({
                "message": "Error creating product",
                "status": 500
            }), 500

    return jsonify({"message": "Invalid request method", "status": 405}), 405


@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided", "status": 400}), 400
        
        # Validate user data
        validation_result = validate_user_data(data)
        if not validation_result["valid"]:
            return jsonify({
                "message": "Validation errors",
                "errors": validation_result["errors"],
                "status": 400
            }), 400
        
        # Sanitize input data
        email = sanitize_string(data["email"]).lower()
        cpf = clean_cpf(data["cpf"])
        
        # Check for existing users
        existing_user = db.users.find_one({"$or": [{"email": email}, {"cpf": cpf}]})
        if existing_user:
            return jsonify({
                "message": "Email or CPF already exists",
                "status": 409
            }), 409
        
        # Generate confirmation token
        token = generate_confirmation_token()
        
        # Prepare user data
        user_data = {
            "name": sanitize_string(data["name"]),
            "email": email,
            "password": generate_password_hash(data["password"]),
            "cpf": cpf,
            "birth_date": data["birth_date"],
            "phone": sanitize_string(data["phone"]),
            "admin": bool(data.get("admin", False)),
            "confirmed": False,
            "confirmation_token": token,
            "confirmation_expires": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            "created_at": datetime.datetime.utcnow(),
            "updated_at": datetime.datetime.utcnow()
        }
        
        # Insert user
        result = db.users.insert_one(user_data)
        
        # Send confirmation email
        send_confirmation_email(email, token)
        
        return jsonify({
            "message": "User successfully created! Please check your email to confirm your account.",
            "user_id": str(result.inserted_id),
            "status": 201
        }), 201
        
    except Exception as e:
        return jsonify({
            "message": "Error creating user",
            "status": 500
        }), 500


@app.route("/api/confirm/<token>", methods=["GET"])
def confirm_email(token):
    try:
        if not token:
            return jsonify({"message": "Token is required", "status": 400}), 400
        
        user = db.users.find_one({"confirmation_token": token})
        if not user:
            return jsonify({"message": "Invalid confirmation token", "status": 400}), 400
        
        if user.get("confirmed", False):
            return jsonify({"message": "User already confirmed", "status": 200}), 200
        
        if datetime.datetime.utcnow() > user.get("confirmation_expires", datetime.datetime.min):
            return jsonify({"message": "Confirmation token expired", "status": 400}), 400
        
        # Update user as confirmed and remove token
        db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "confirmed": True,
                    "updated_at": datetime.datetime.utcnow()
                },
                "$unset": {
                    "confirmation_token": "",
                    "confirmation_expires": ""
                }
            }
        )
        
        return jsonify({"message": "User successfully confirmed!", "status": 200}), 200
        
    except Exception as e:
        return jsonify({"message": "Error confirming user", "status": 500}), 500


@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided", "status": 400}), 400
        
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return jsonify({"message": "Email and password are required", "status": 400}), 400
        
        # Sanitize email
        email = sanitize_string(email).lower()
        
        # Find user
        user = db.users.find_one({"email": email})
        if not user:
            return jsonify({"message": "Invalid credentials", "status": 401}), 401
        
        # Check if user is confirmed
        if not user.get("confirmed", False):
            return jsonify({
                "message": "Please confirm your email before logging in",
                "status": 401
            }), 401
        
        # Verify password
        if not check_password_hash(user["password"], password):
            return jsonify({"message": "Invalid credentials", "status": 401}), 401
        
        # Create JWT token
        token_payload = {
            "user_id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "admin": user.get("admin", False),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2),
            "iat": datetime.datetime.utcnow()
        }
        
        token = jwt.encode(
            token_payload,
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )
        
        # Update last login
        db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.datetime.utcnow()}}
        )
        
        return jsonify({
            "message": "User successfully logged in!",
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "admin": user.get("admin", False)
            },
            "status": 200
        }), 200
        
    except Exception as e:
        return jsonify({"message": "Error during login", "status": 500}), 500


@app.route("/api/profile", methods=["GET"])
@token_required
def profile():
    try:
        # User information is already available from token_required decorator
        user_id = request.user_id
        
        user = db.users.find_one({"_id": user_id})
        if not user:
            return jsonify({"message": "User not found", "status": 404}), 404
        
        return jsonify({
            "message": "User profile retrieved successfully",
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "cpf": user["cpf"],
                "birth_date": user["birth_date"],
                "phone": user["phone"],
                "admin": user.get("admin", False),
                "created_at": user.get("created_at"),
                "last_login": user.get("last_login")
            },
            "status": 200
        }), 200
        
    except Exception as e:
        return jsonify({"message": "Error retrieving profile", "status": 500}), 500


@app.route("/api/profile/edit", methods=["PUT"])
@token_required
def update_profile():
    try:
        user_id = request.user_id
        data = request.get_json()
        
        if not data:
            return jsonify({"message": "No data provided", "status": 400}), 400
        
        # Prepare validation data
        validation_data = {
            "name": data.get("name"),
            "email": data.get("email"),
            "phone": data.get("phone")
        }
        
        # Basic validation
        errors = []
        
        if not validation_data["name"]:
            errors.append("Name is required")
        elif len(validation_data["name"].strip()) < 2:
            errors.append("Name must be at least 2 characters long")
        
        if not validation_data["email"]:
            errors.append("Email is required")
        elif not validate_email(validation_data["email"]):
            errors.append("Invalid email format")
        
        if not validation_data["phone"]:
            errors.append("Phone is required")
        elif not validate_phone(validation_data["phone"]):
            errors.append("Invalid phone number format")
        
        if errors:
            return jsonify({
                "message": "Validation errors",
                "errors": errors,
                "status": 400
            }), 400
        
        # Check if email is already taken by another user
        email = sanitize_string(validation_data["email"]).lower()
        existing_user = db.users.find_one({
            "email": email,
            "_id": {"$ne": user_id}
        })
        
        if existing_user:
            return jsonify({
                "message": "Email already exists",
                "status": 409
            }), 409
        
        # Prepare update data
        update_data = {
            "name": sanitize_string(validation_data["name"]),
            "email": email,
            "phone": sanitize_string(validation_data["phone"]),
            "updated_at": datetime.datetime.utcnow()
        }
        
        # Update user
        result = db.users.update_one(
            {"_id": user_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "User not found", "status": 404}), 404
        
        return jsonify({
            "message": "Profile updated successfully!",
            "status": 200
        }), 200
        
    except Exception as e:
        return jsonify({"message": "Error updating profile", "status": 500}), 500
