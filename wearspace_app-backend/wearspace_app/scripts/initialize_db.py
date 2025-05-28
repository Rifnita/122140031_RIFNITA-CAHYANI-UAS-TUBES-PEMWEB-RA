import argparse
import sys
import uuid
from datetime import datetime

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError
import transaction # Import transaction explicitly if you want to control it manually outside Pyramid's tm

from ..models import (
    User,
    Brand,
    Product,
    Transaction,
    Favorite,
    Inspiration,
)

def setup_models(dbsession):
    """
    Add sample data to the database for Wearspace App.
    """
    print("🚀 Initializing Wearspace App database with sample data...")

    # Generate fresh, valid UUIDs for all sample data
    user_admin_id = uuid.uuid4()
    user_customer_id = uuid.uuid4()
    brand_nike_id = uuid.uuid4()
    brand_adidas_id = uuid.uuid4()
    product_shoe_id = uuid.uuid4()
    product_tshirt_id = uuid.uuid4()
    transaction_1_id = uuid.uuid4()
    transaction_2_id = uuid.uuid4()
    inspiration_1_id = uuid.uuid4()
    inspiration_2_id = uuid.uuid4()

    # --- Sample Users ---
    user_admin = User(
        id=user_admin_id,
        email="admin@wearspace.com",
        phone="081234567890",
        address="Jl. Admin No. 1, Jakarta"
    )
    user_admin.set_password("adminpass")
    dbsession.add(user_admin)

    user_customer = User(
        id=user_customer_id,
        email="customer@wearspace.com",
        phone="087654321000",
        address="Jl. Pelanggan No. 5, Bandung"
    )
    user_customer.set_password("customerpass")
    dbsession.add(user_customer)

    # --- Sample Brands ---
    brand_nike = Brand(
        id=brand_nike_id,
        name="Nike"
    )
    dbsession.add(brand_nike)

    brand_adidas = Brand(
        id=brand_adidas_id,
        name="Adidas"
    )
    dbsession.add(brand_adidas)

    # --- Sample Products ---
    product_shoe = Product(
        id=product_shoe_id,
        name="Nike Air Max 270",
        brand_id=brand_nike_id,
        price=150.00,
        description="Comfortable and stylish running shoes.",
        image_url="https://example.com/nike_airmax.jpg",
        material="Mesh, Rubber",
        category="Footwear",
        stock=50,
        sizes=['US 7', 'US 8', 'US 9', 'US 10'],
        colors=['Black', 'White', 'Red']
    )
    dbsession.add(product_shoe)

    product_tshirt = Product(
        id=product_tshirt_id,
        name="Adidas Trefoil T-Shirt",
        brand_id=brand_adidas_id,
        price=30.00,
        description="Classic cotton t-shirt with Adidas logo.",
        image_url="https://example.com/adidas_tshirt.jpg",
        material="Cotton",
        category="Apparel",
        stock=100,
        sizes=['S', 'M', 'L', 'XL'],
        colors=['Blue', 'Black']
    )
    dbsession.add(product_tshirt)

    # --- Sample Transactions ---
    transaction_1 = Transaction(
        id=transaction_1_id,
        user_id=user_customer_id,
        product_id=product_shoe_id,
        customer_name="John Doe",
        shipping_address="123 Main St, Anytown, USA",
        payment_method="Credit Card",
        transaction_status="Berhasil",
        purchased_size="US 9",
        purchased_color="Black",
        transaction_date=datetime(2025, 5, 20, 10, 30, 0)
    )
    dbsession.add(transaction_1)

    transaction_2 = Transaction(
        id=transaction_2_id,
        user_id=None, # Contoh transaksi tanpa user terdaftar (guest checkout)
        product_id=product_tshirt_id,
        customer_name="Jane Smith",
        shipping_address="456 Oak Ave, Othercity, USA",
        payment_method="PayPal",
        transaction_status="Menunggu Pembayaran",
        purchased_size="M",
        purchased_color="Blue",
        transaction_date=datetime(2025, 5, 25, 14, 0, 0)
    )
    dbsession.add(transaction_2)

    # --- Sample Favorites ---
    favorite_1 = Favorite(
        user_id=user_customer_id,
        product_id=product_shoe_id,
        created_at=datetime(2025, 5, 18, 9, 0, 0)
    )
    dbsession.add(favorite_1)

    # --- Sample Inspirations ---
    inspiration_1 = Inspiration(
        id=inspiration_1_id,
        title="Summer Style Guide",
        description="Latest trends for summer fashion.",
        image_url="https://example.com/summer_style.jpg",
        tag="Summer, Fashion, Trends",
        created_at=datetime(2025, 4, 1, 10, 0, 0)
    )
    dbsession.add(inspiration_1)

    inspiration_2 = Inspiration(
        id=inspiration_2_id,
        title="Sportswear Essentials",
        description="Must-have items for your workout.",
        image_url="https://example.com/sportswear.jpg",
        tag="Sport, Fitness, Essentials",
        created_at=datetime(2025, 4, 15, 11, 0, 0)
    )
    dbsession.add(inspiration_2)


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Configuration file, e.g., development.ini',
    )
    return parser.parse_args(argv[1:])


def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)

    env = None # Initialize env to None outside try block
    try:
        env = bootstrap(args.config_uri)
        with env['request'].tm: # This context manager automatically handles commit/rollback
            dbsession = env['request'].dbsession
            setup_models(dbsession)
            print("✅ Sample data for Wearspace App inserted successfully.")
    except OperationalError as err:
        print("❌ OperationalError:", err)
        print('''
Database connection failed. The problem might be caused by one of the following:

1. You may need to initialize your database tables with `alembic upgrade head`.
   Make sure you have run Alembic migrations.

2. Your database server may not be running or misconfigured. Check that the
   database server referred to by the "sqlalchemy.url" setting in
   your "development.ini" file is running and accessible.
        ''')
        # pyramid_tm will automatically abort the transaction if an OperationalError occurs
        # so explicit abort() is not strictly needed here for this error type.
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        # For general exceptions, `with env['request'].tm:` should still handle rollback.
        # Re-raise the exception to see its full traceback if it's not OperationalError
        raise