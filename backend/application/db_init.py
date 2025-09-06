"""
Database initialization and index creation for MongoDB
"""
from application import db


def create_indexes():
    """Create database indexes for performance optimization"""
    
    # Users collection indexes
    db.users.create_index("email", unique=True)
    db.users.create_index("cpf", unique=True)
    db.users.create_index("confirmation_token")
    db.users.create_index("created_at")
    db.users.create_index([
        ("email", 1),
        ("confirmed", 1)
    ])
    
    # Products collection indexes
    db.products.create_index("title", unique=True)
    db.products.create_index("category")
    db.products.create_index("price")
    db.products.create_index("on_sale")
    db.products.create_index("rating")
    db.products.create_index("created_at")
    db.products.create_index([
        ("category", 1),
        ("price", 1)
    ])
    db.products.create_index([
        ("on_sale", 1),
        ("sale_price", 1)
    ])
    
    # Text search index for products
    db.products.create_index([
        ("title", "text"),
        ("description", "text"),
        ("category", "text")
    ])
    
    print("Database indexes created successfully!")


def check_database_connection():
    """Check if database connection is working"""
    try:
        # Attempt to get server info
        db.command("serverStatus")
        print("✓ Database connection successful")
        return True
    except Exception as e:
        print(f"✗ Database connection failed: {str(e)}")
        return False


if __name__ == "__main__":
    if check_database_connection():
        create_indexes()
    else:
        print("Cannot create indexes - database connection failed")