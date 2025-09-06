"""
Data validation utilities for the e-commerce application
"""
import re
from datetime import datetime
from typing import Dict, Any, List


class ValidationError(Exception):
    """Custom exception for validation errors"""
    pass


def validate_email(email: str) -> bool:
    """Validate email format"""
    if not email or not isinstance(email, str):
        return False
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_cpf(cpf: str) -> bool:
    """Validate Brazilian CPF format and checksum"""
    if not cpf or not isinstance(cpf, str):
        return False
    
    # Remove non-numeric characters
    cpf = re.sub(r'[^0-9]', '', cpf)
    
    # Check length
    if len(cpf) != 11:
        return False
    
    # Check for known invalid patterns
    if cpf == cpf[0] * 11:
        return False
    
    # Calculate first check digit
    sum1 = sum(int(cpf[i]) * (10 - i) for i in range(9))
    digit1 = 11 - (sum1 % 11)
    if digit1 >= 10:
        digit1 = 0
    
    # Calculate second check digit
    sum2 = sum(int(cpf[i]) * (11 - i) for i in range(10))
    digit2 = 11 - (sum2 % 11)
    if digit2 >= 10:
        digit2 = 0
    
    return int(cpf[9]) == digit1 and int(cpf[10]) == digit2


def validate_phone(phone: str) -> bool:
    """Validate Brazilian phone number format"""
    if not phone or not isinstance(phone, str):
        return False
    
    # Remove non-numeric characters
    phone = re.sub(r'[^0-9]', '', phone)
    
    # Check for valid Brazilian phone formats (10 or 11 digits)
    return len(phone) in [10, 11] and phone[0:2] in ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99']


def validate_password(password: str) -> Dict[str, Any]:
    """Validate password strength"""
    if not password or not isinstance(password, str):
        return {"valid": False, "errors": ["Password is required"]}
    
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number")
    
    return {"valid": len(errors) == 0, "errors": errors}


def validate_user_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate user registration data"""
    errors = []
    
    # Required fields
    required_fields = ['name', 'email', 'password', 'cpf', 'birth_date', 'phone']
    for field in required_fields:
        if not data.get(field):
            errors.append(f"{field.capitalize()} is required")
    
    # Email validation
    if data.get('email') and not validate_email(data['email']):
        errors.append("Invalid email format")
    
    # CPF validation
    if data.get('cpf') and not validate_cpf(data['cpf']):
        errors.append("Invalid CPF format")
    
    # Phone validation
    if data.get('phone') and not validate_phone(data['phone']):
        errors.append("Invalid phone number format")
    
    # Password validation
    if data.get('password'):
        password_result = validate_password(data['password'])
        if not password_result['valid']:
            errors.extend(password_result['errors'])
    
    # Name validation
    if data.get('name'):
        name = data['name'].strip()
        if len(name) < 2:
            errors.append("Name must be at least 2 characters long")
        if len(name) > 100:
            errors.append("Name must be less than 100 characters")
    
    # Birth date validation
    if data.get('birth_date'):
        try:
            birth_date = datetime.fromisoformat(data['birth_date'].replace('Z', '+00:00'))
            today = datetime.now()
            age = today.year - birth_date.year
            if age < 13:
                errors.append("User must be at least 13 years old")
            if age > 120:
                errors.append("Invalid birth date")
        except (ValueError, AttributeError):
            errors.append("Invalid birth date format")
    
    return {"valid": len(errors) == 0, "errors": errors}


def validate_product_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate product data"""
    errors = []
    
    # Required fields
    required_fields = ['title', 'price', 'description', 'category', 'quantity']
    for field in required_fields:
        if not data.get(field):
            errors.append(f"{field.capitalize()} is required")
    
    # Price validation
    if data.get('price'):
        try:
            price = float(data['price'])
            if price <= 0:
                errors.append("Price must be greater than 0")
        except (ValueError, TypeError):
            errors.append("Invalid price format")
    
    # Sale price validation
    if data.get('sale_price'):
        try:
            sale_price = float(data['sale_price'])
            if sale_price <= 0:
                errors.append("Sale price must be greater than 0")
            if data.get('price') and sale_price >= float(data['price']):
                errors.append("Sale price must be less than regular price")
        except (ValueError, TypeError):
            errors.append("Invalid sale price format")
    
    # Quantity validation
    if data.get('quantity'):
        try:
            quantity = int(data['quantity'])
            if quantity < 0:
                errors.append("Quantity cannot be negative")
        except (ValueError, TypeError):
            errors.append("Invalid quantity format")
    
    # Rating validation
    if data.get('rating'):
        try:
            rating = float(data['rating'])
            if not 0 <= rating <= 5:
                errors.append("Rating must be between 0 and 5")
        except (ValueError, TypeError):
            errors.append("Invalid rating format")
    
    # Title validation
    if data.get('title'):
        title = data['title'].strip()
        if len(title) < 3:
            errors.append("Title must be at least 3 characters long")
        if len(title) > 200:
            errors.append("Title must be less than 200 characters")
    
    # Description validation
    if data.get('description'):
        description = data['description'].strip()
        if len(description) < 10:
            errors.append("Description must be at least 10 characters long")
        if len(description) > 1000:
            errors.append("Description must be less than 1000 characters")
    
    return {"valid": len(errors) == 0, "errors": errors}


def sanitize_string(value: str) -> str:
    """Sanitize string input"""
    if not isinstance(value, str):
        return str(value) if value is not None else ""
    
    # Remove leading/trailing whitespace
    value = value.strip()
    
    # Remove potentially dangerous characters
    value = re.sub(r'[<>"\']', '', value)
    
    return value