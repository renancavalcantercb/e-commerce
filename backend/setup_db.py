#!/usr/bin/env python3
"""
Database setup script for e-commerce application
Run this script after setting up your environment to initialize database indexes
"""

import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from application.db_init import create_indexes, check_database_connection
from application import app

def main():
    """Main setup function"""
    print("🚀 Starting e-commerce database setup...")
    print("=" * 50)
    
    with app.app_context():
        # Check database connection
        print("📡 Checking database connection...")
        if not check_database_connection():
            print("❌ Database setup failed - connection issue")
            sys.exit(1)
        
        # Create indexes
        print("📊 Creating database indexes...")
        try:
            create_indexes()
            print("✅ Database indexes created successfully!")
        except Exception as e:
            print(f"❌ Error creating indexes: {str(e)}")
            sys.exit(1)
    
    print("=" * 50)
    print("🎉 Database setup completed successfully!")
    print("")
    print("Next steps:")
    print("1. Start the Flask application: python run.py")
    print("2. Test API endpoints")
    print("3. Check that all validations are working")

if __name__ == "__main__":
    main()