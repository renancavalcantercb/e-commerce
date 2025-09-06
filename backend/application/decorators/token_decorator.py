from functools import wraps
from flask import request, jsonify
from application import app, db
from bson import ObjectId
import jwt
import datetime


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"message": "Authorization header missing", "status": 401}), 401
        
        if not auth_header.startswith("Bearer "):
            return jsonify({"message": "Invalid authorization header format", "status": 401}), 401

        try:
            token = auth_header.split(" ")[1]
            if not token:
                return jsonify({"message": "Token missing from header", "status": 401}), 401
        except IndexError:
            return jsonify({"message": "Invalid authorization header format", "status": 401}), 401

        try:
            decoded = jwt.decode(
                token, 
                app.config["SECRET_KEY"], 
                algorithms=["HS256"]
            )
            
            # Verify token hasn't expired (additional check)
            if decoded.get("exp") and datetime.datetime.fromtimestamp(decoded["exp"]) < datetime.datetime.utcnow():
                return jsonify({"message": "Token has expired", "status": 401}), 401
            
            # Verify user still exists and is confirmed
            user_id = ObjectId(decoded["user_id"])
            user = db.users.find_one({"_id": user_id})
            
            if not user:
                return jsonify({"message": "User not found", "status": 401}), 401
            
            if not user.get("confirmed", False):
                return jsonify({"message": "User account not confirmed", "status": 401}), 401
            
            # Add user information to request object
            request.user_id = user_id
            request.user = {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "admin": user.get("admin", False)
            }
            
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired", "status": 401}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token", "status": 401}), 401
        except jwt.DecodeError:
            return jsonify({"message": "Token decode error", "status": 401}), 401
        except Exception as e:
            # Log the error for debugging (don't expose to client)
            app.logger.error(f"Token validation error: {str(e)}")
            return jsonify({"message": "Token validation failed", "status": 401}), 401

        return f(*args, **kwargs)

    return decorated


def admin_required(f):
    """Decorator to require admin privileges"""
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if not request.user.get("admin", False):
            return jsonify({"message": "Admin privileges required", "status": 403}), 403
        return f(*args, **kwargs)
    return decorated
