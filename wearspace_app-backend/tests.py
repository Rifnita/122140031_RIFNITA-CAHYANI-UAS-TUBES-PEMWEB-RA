import unittest
import transaction
import uuid
from datetime import datetime, timedelta

from pyramid import testing
from webob.multidict import MultiDict
from webob.response import Response
from webob.exc import HTTPNotFound, HTTPBadRequest, HTTPUnauthorized, HTTPConflict

from sqlalchemy import engine_from_config

from .wearspace_app.models import (
    Base,
    User,
    Brand,
    Product,
    Transaction,
    Favorite,
    Inspiration,
    get_session_factory,
    get_tm_session,
)

# Helper function to create a dummy request with a dbsession
def _get_app_request(dbsession, userid=None):
    request = testing.DummyRequest()
    request.dbsession = dbsession
    # Mock authenticated_userid for testing authenticated routes
    if userid:
        request.authenticated_userid = str(userid)
    return request

class BaseTest(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp(settings={
            'sqlalchemy.url': 'sqlite:///:memory:',
            'session.secret': 'test_session_secret',
            'auth.secret': 'test_auth_secret',
        })
        self.config.include('pyramid_tm')
        self.config.include('pyramid_sqlalchemy')
        self.config.include('pyramid_retry')
        self.config.include('..models')
        self.config.include('..routes') # Include routes to resolve view_config
        self.config.scan('.wearspace_app.views.api') # Scan specific API views

        settings = self.config.get_settings()
        self.engine = engine_from_config(settings, 'sqlalchemy.')
        Base.metadata.create_all(self.engine) # Create all tables
        session_factory = get_session_factory(self.engine)
        self.dbsession = get_tm_session(session_factory, transaction.manager)

        # Seed initial data for consistent testing
        self._seed_data()

    def tearDown(self):
        testing.tearDown()
        transaction.abort()
        Base.metadata.drop_all(self.engine) # Drop all tables

    def _seed_data(self):
        self.test_user_id = uuid.uuid4()
        self.test_user_email = "test@example.com"
        self.test_user_password = "password123"
        self.test_user = User(
            id=self.test_user_id,
            email=self.test_user_email,
            phone="1234567890",
            address="123 Test St"
        )
        self.test_user.set_password(self.test_user_password)
        self.dbsession.add(self.test_user)

        self.test_admin_id = uuid.uuid4()
        self.test_admin_email = "admin@example.com"
        self.test_admin_password = "adminpass"
        self.test_admin = User(
            id=self.test_admin_id,
            email=self.test_admin_email,
            phone="0987654321",
            address="Admin Rd"
        )
        self.test_admin.set_password(self.test_admin_password)
        self.dbsession.add(self.test_admin)

        self.test_brand_id = uuid.uuid4()
        self.test_brand = Brand(id=self.test_brand_id, name="Test Brand")
        self.dbsession.add(self.test_brand)

        self.test_product_id = uuid.uuid4()
        self.test_product = Product(
            id=self.test_product_id,
            name="Test Product",
            brand_id=self.test_brand_id,
            price=99.99,
            description="A test product",
            image_url="http://example.com/test.jpg",
            material="Cotton",
            category="Apparel",
            stock=10,
            sizes=["M", "L"],
            colors=["Red", "Blue"]
        )
        self.dbsession.add(self.test_product)

        self.test_inspiration_id = uuid.uuid4()
        self.test_inspiration = Inspiration(
            id=self.test_inspiration_id,
            title="Test Inspiration",
            description="Inspiring test content",
            image_url="http://example.com/inspiration.jpg",
            tag="Test,Inspire"
        )
        self.dbsession.add(self.test_inspiration)

        transaction.commit() # Commit seed data

    # Helper for JSON responses
    def _assert_json_response(self, response, status_code, expected_keys=None):
        self.assertEqual(response.status_code, status_code)
        self.assertEqual(response.content_type, 'application/json')
        self.assertIsInstance(response.json, dict)
        if expected_keys:
            for key in expected_keys:
                self.assertIn(key, response.json)


# --- User API Tests ---
class UserAPITests(BaseTest):
    def test_register_user_success(self):
        from .wearspace_app.views.api import register_user
        request = _get_app_request(self.dbsession)
        request.json_body = {
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'phone': '111222333',
            'address': '456 New St'
        }
        response = register_user(request)
        self._assert_json_response(response, 201, ['message', 'user'])
        self.assertEqual(response.json['user']['email'], 'newuser@example.com')
        self.assertNotIn('hashed_password', response.json['user']) # Ensure password is not exposed

    def test_register_user_missing_fields(self):
        from .wearspace_app.views.api import register_user
        request = _get_app_request(self.dbsession)
        request.json_body = {'email': 'incomplete@example.com'} # Missing password
        with self.assertRaises(HTTPBadRequest):
            register_user(request)

    def test_register_user_email_exists(self):
        from .wearspace_app.views.api import register_user
        request = _get_app_request(self.dbsession)
        request.json_body = {
            'email': self.test_user_email, # Existing email
            'password': 'somepassword'
        }
        with self.assertRaises(HTTPConflict):
            register_user(request)

    def test_login_user_success(self):
        from .wearspace_app.views.api import login_user
        request = _get_app_request(self.dbsession)
        request.json_body = {
            'email': self.test_user_email,
            'password': self.test_user_password
        }
        response = login_user(request)
        self._assert_json_response(response, 200, ['message', 'user', 'authenticated_userid'])
        self.assertEqual(response.json['user']['email'], self.test_user_email)
        self.assertIn('Set-Cookie', response.headers)

    def test_login_user_invalid_credentials(self):
        from .wearspace_app.views.api import login_user
        request = _get_app_request(self.dbsession)
        request.json_body = {
            'email': self.test_user_email,
            'password': 'wrongpassword'
        }
        with self.assertRaises(HTTPUnauthorized):
            login_user(request)

    def test_logout_user_success(self):
        from .wearspace_app.views.api import logout_user
        request = _get_app_request(self.dbsession, userid=self.test_user_id)
        response = logout_user(request)
        self._assert_json_response(response, 200, ['message'])
        self.assertEqual(response.json['message'], 'Logged out successfully.')
        self.assertIn('Set-Cookie', response.headers) # Should contain headers to clear cookie

    def test_get_users_success(self):
        from .wearspace_app.views.api import get_users
        request = _get_app_request(self.dbsession)
        response = get_users(request)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)
        self.assertGreaterEqual(len(response.json), 2) # At least test_user and test_admin
        self.assertIn(self.test_user_email, [u['email'] for u in response.json])

    def test_get_user_by_id_success(self):
        from .wearspace_app.views.api import get_user
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_user_id)
        response = get_user(request)
        self._assert_json_response(response, 200, ['id', 'email'])
        self.assertEqual(response.json['id'], str(self.test_user_id))
        self.assertEqual(response.json['email'], self.test_user_email)

    def test_get_user_by_id_not_found(self):
        from .wearspace_app.views.api import get_user
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(uuid.uuid4()) # Non-existent ID
        with self.assertRaises(HTTPNotFound):
            get_user(request)

    def test_get_user_by_id_invalid_uuid(self):
        from .wearspace_app.views.api import get_user
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = 'invalid-uuid'
        with self.assertRaises(HTTPBadRequest):
            get_user(request)

    def test_update_user_success(self):
        from .wearspace_app.views.api import update_user
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_user_id)
        request.json_body = {
            'phone': '9876543210',
            'address': 'Updated Address'
        }
        response = update_user(request)
        self._assert_json_response(response, 200, ['id', 'email', 'phone', 'address'])
        self.assertEqual(response.json['phone'], '9876543210')
        self.assertEqual(response.json['address'], 'Updated Address')

        updated_user = self.dbsession.query(User).get(self.test_user_id)
        self.assertEqual(updated_user.phone, '9876543210')

    def test_update_user_change_password(self):
        from .wearspace_app.views.api import update_user
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_user_id)
        new_password = "newsecurepassword"
        request.json_body = {'password': new_password}
        response = update_user(request)
        self._assert_json_response(response, 200, ['id', 'email'])
        self.assertNotIn('hashed_password', response.json)

        updated_user = self.dbsession.query(User).get(self.test_user_id)
        self.assertTrue(updated_user.check_password(new_password))


    def test_update_user_email_conflict(self):
        from .wearspace_app.views.api import update_user
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_user_id)
        request.json_body = {'email': self.test_admin_email} # Try to change to existing email
        with self.assertRaises(HTTPConflict):
            update_user(request)

    def test_delete_user_success(self):
        from .wearspace_app.views.api import delete_user
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_user_id)
        response = delete_user(request)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.json, {'message': 'User deleted successfully'})
        
        # Verify user is deleted
        deleted_user = self.dbsession.query(User).get(self.test_user_id)
        self.assertIsNone(deleted_user)

    def test_delete_user_not_found(self):
        from .wearspace_app.views.api import delete_user
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(uuid.uuid4())
        with self.assertRaises(HTTPNotFound):
            delete_user(request)

# --- Brand API Tests ---
class BrandAPITests(BaseTest):
    def test_get_brands_success(self):
        from .wearspace_app.views.api import get_brands
        request = _get_app_request(self.dbsession)
        response = get_brands(request)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)
        self.assertGreaterEqual(len(response.json), 1)
        self.assertIn(self.test_brand.name, [b['name'] for b in response.json])

    def test_create_brand_success(self):
        from .wearspace_app.views.api import create_brand
        request = _get_app_request(self.dbsession)
        request.json_body = {'name': 'New Brand Name'}
        response = create_brand(request)
        self._assert_json_response(response, 201, ['id', 'name'])
        self.assertEqual(response.json['name'], 'New Brand Name')

    def test_create_brand_missing_name(self):
        from .wearspace_app.views.api import create_brand
        request = _get_app_request(self.dbsession)
        request.json_body = {}
        with self.assertRaises(HTTPBadRequest):
            create_brand(request)

    def test_create_brand_name_conflict(self):
        from .wearspace_app.views.api import create_brand
        request = _get_app_request(self.dbsession)
        request.json_body = {'name': self.test_brand.name} # Existing brand name
        with self.assertRaises(HTTPConflict):
            create_brand(request)

    def test_update_brand_success(self):
        from .wearspace_app.views.api import update_brand
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_brand_id)
        request.json_body = {'name': 'Updated Brand Name'}
        response = update_brand(request)
        self._assert_json_response(response, 200, ['id', 'name'])
        self.assertEqual(response.json['name'], 'Updated Brand Name')

    def test_update_brand_not_found(self):
        from .wearspace_app.views.api import update_brand
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(uuid.uuid4())
        request.json_body = {'name': 'NonExistent'}
        with self.assertRaises(HTTPNotFound):
            update_brand(request)

    def test_update_brand_name_conflict(self):
        from .wearspace_app.views.api import update_brand
        # Create a second brand to cause a conflict
        second_brand_id = uuid.uuid4()
        second_brand = Brand(id=second_brand_id, name="Another Brand")
        self.dbsession.add(second_brand)
        transaction.commit()

        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_brand_id)
        request.json_body = {'name': second_brand.name} # Try to change to existing name
        with self.assertRaises(HTTPConflict):
            update_brand(request)

    def test_delete_brand_success(self):
        from .wearspace_app.views.api import delete_brand
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_brand_id)
        response = delete_brand(request)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.json, {'message': 'Brand deleted successfully'})
        
        deleted_brand = self.dbsession.query(Brand).get(self.test_brand_id)
        self.assertIsNone(deleted_brand)

    def test_delete_brand_not_found(self):
        from .wearspace_app.views.api import delete_brand
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(uuid.uuid4())
        with self.assertRaises(HTTPNotFound):
            delete_brand(request)

# --- Product API Tests ---
class ProductAPITests(BaseTest):
    def test_get_products_success(self):
        from .wearspace_app.views.api import get_products
        request = _get_app_request(self.dbsession)
        response = get_products(request)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)
        self.assertGreaterEqual(len(response.json), 1)
        self.assertIn(self.test_product.name, [p['name'] for p in response.json])

    def test_create_product_success(self):
        from .wearspace_app.views.api import create_product
        request = _get_app_request(self.dbsession)
        request.json_body = {
            'name': 'New Shoe',
            'brand_id': str(self.test_brand_id),
            'price': 120.00,
            'stock': 20,
            'sizes': ['S', 'M'],
            'colors': ['Green']
        }
        response = create_product(request)
        self._assert_json_response(response, 201, ['id', 'name', 'brand_id', 'price'])
        self.assertEqual(response.json['name'], 'New Shoe')
        self.assertEqual(response.json['brand_id'], str(self.test_brand_id))

    def test_create_product_missing_fields(self):
        from .wearspace_app.views.api import create_product
        request = _get_app_request(self.dbsession)
        request.json_body = {'name': 'Partial Product'} # Missing other required fields
        with self.assertRaises(HTTPBadRequest):
            create_product(request)

    def test_create_product_invalid_brand_id(self):
        from .wearspace_app.views.api import create_product
        request = _get_app_request(self.dbsession)
        request.json_body = {
            'name': 'Invalid Product',
            'brand_id': str(uuid.uuid4()), # Non-existent brand ID
            'price': 50.00,
            'stock': 5,
            'sizes': ['M'],
            'colors': ['Yellow']
        }
        with self.assertRaises(HTTPBadRequest):
            create_product(request)

    def test_get_product_by_id_success(self):
        from .wearspace_app.views.api import get_product
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_product_id)
        response = get_product(request)
        self._assert_json_response(response, 200, ['id', 'name'])
        self.assertEqual(response.json['id'], str(self.test_product_id))
        self.assertEqual(response.json['name'], self.test_product.name)

    def test_get_product_by_id_not_found(self):
        from .wearspace_app.views.api import get_product
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(uuid.uuid4())
        with self.assertRaises(HTTPNotFound):
            get_product(request)

    def test_update_product_success(self):
        from .wearspace_app.views.api import update_product
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_product_id)
        request.json_body = {
            'price': 110.00,
            'stock': 15,
            'description': 'Updated description'
        }
        response = update_product(request)
        self._assert_json_response(response, 200, ['id', 'price', 'stock', 'description'])
        self.assertEqual(response.json['price'], 110.00)
        self.assertEqual(response.json['stock'], 15)
        self.assertEqual(response.json['description'], 'Updated description')

    def test_update_product_change_brand(self):
        from .wearspace_app.views.api import update_product
        new_brand_id = uuid.uuid4()
        new_brand = Brand(id=new_brand_id, name="New Brand for Product")
        self.dbsession.add(new_brand)
        transaction.commit()

        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_product_id)
        request.json_body = {'brand_id': str(new_brand_id)}
        response = update_product(request)
        self._assert_json_response(response, 200, ['id', 'brand_id'])
        self.assertEqual(response.json['brand_id'], str(new_brand_id))

    def test_update_product_invalid_new_brand_id(self):
        from .wearspace_app.views.api import update_product
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_product_id)
        request.json_body = {'brand_id': str(uuid.uuid4())} # Non-existent brand
        with self.assertRaises(HTTPBadRequest):
            update_product(request)

    def test_delete_product_success(self):
        from .wearspace_app.views.api import delete_product
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_product_id)
        response = delete_product(request)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.json, {'message': 'Product deleted successfully'})
        
        deleted_product = self.dbsession.query(Product).get(self.test_product_id)
        self.assertIsNone(deleted_product)

    def test_delete_product_not_found(self):
        from .wearspace_app.views.api import delete_product
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(uuid.uuid4())
        with self.assertRaises(HTTPNotFound):
            delete_product(request)

# --- Transaction API Tests ---
class TransactionAPITests(BaseTest):
    def test_get_transactions_success(self):
        from .wearspace_app.views.api import get_transactions
        # Add a test transaction
        test_transaction_id = uuid.uuid4()
        test_transaction = Transaction(
            id=test_transaction_id,
            user_id=self.test_user_id,
            product_id=self.test_product_id,
            customer_name="Customer Name",
            shipping_address="123 Road",
            payment_method="Bank Transfer",
            purchased_size="M",
            purchased_color="Blue",
            transaction_status="Menunggu Pembayaran"
        )
        self.dbsession.add(test_transaction)
        transaction.commit()

        request = _get_app_request(self.dbsession)
        response = get_transactions(request)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)
        self.assertGreaterEqual(len(response.json), 1)
        self.assertTrue(any(t['id'] == str(test_transaction_id) for t in response.json))
        # Ensure product and user details are included in serialization
        self.assertIn('product', response.json[0])
        self.assertIn('user', response.json[0])


    def test_create_transaction_logged_in_success(self):
        from .wearspace_app.views.api import create_transaction
        initial_stock = self.test_product.stock
        request = _get_app_request(self.dbsession, userid=self.test_user_id)
        request.json_body = {
            'product_id': str(self.test_product_id),
            'customer_name': 'LoggedIn Customer',
            'shipping_address': 'Logged In Address',
            'payment_method': 'Credit Card',
            'purchased_size': 'M',
            'purchased_color': 'Red'
        }
        response = create_transaction(request)
        self._assert_json_response(response, 201, ['id', 'user_id', 'product_id', 'transaction_status'])
        self.assertEqual(response.json['user_id'], str(self.test_user_id))
        self.assertEqual(response.json['transaction_status'], 'Menunggu Pembayaran')

        updated_product = self.dbsession.query(Product).get(self.test_product_id)
        self.assertEqual(updated_product.stock, initial_stock - 1)

    def test_create_transaction_guest_success(self):
        from .wearspace_app.views.api import create_transaction
        initial_stock = self.test_product.stock
        request = _get_app_request(self.dbsession) # No authenticated user
        request.json_body = {
            'product_id': str(self.test_product_id),
            'customer_name': 'Guest Customer',
            'shipping_address': 'Guest Address',
            'payment_method': 'Cash on Delivery',
            'purchased_size': 'L',
            'purchased_color': 'Blue'
        }
        response = create_transaction(request)
        self._assert_json_response(response, 201, ['id', 'product_id', 'transaction_status'])
        self.assertIsNone(response.json['user_id']) # user_id should be None for guest
        self.assertEqual(response.json['transaction_status'], 'Menunggu Pembayaran')

        updated_product = self.dbsession.query(Product).get(self.test_product_id)
        self.assertEqual(updated_product.stock, initial_stock - 1)

    def test_create_transaction_missing_fields(self):
        from .wearspace_app.views.api import create_transaction
        request = _get_app_request(self.dbsession, userid=self.test_user_id)
        request.json_body = {'product_id': str(self.test_product_id)} # Missing many fields
        with self.assertRaises(HTTPBadRequest):
            create_transaction(request)

    def test_create_transaction_product_not_found(self):
        from .wearspace_app.views.api import create_transaction
        request = _get_app_request(self.dbsession, userid=self.test_user_id)
        request.json_body = {
            'product_id': str(uuid.uuid4()), # Non-existent product
            'customer_name': 'Customer',
            'shipping_address': 'Address',
            'payment_method': 'Method',
            'purchased_size': 'S',
            'purchased_color': 'Green'
        }
        with self.assertRaises(HTTPBadRequest):
            create_transaction(request)

    def test_create_transaction_product_out_of_stock(self):
        from .wearspace_app.views.api import create_transaction
        self.test_product.stock = 0 # Set stock to 0
        transaction.commit()

        request = _get_app_request(self.dbsession, userid=self.test_user_id)
        request.json_body = {
            'product_id': str(self.test_product_id),
            'customer_name': 'Customer',
            'shipping_address': 'Address',
            'payment_method': 'Method',
            'purchased_size': 'S',
            'purchased_color': 'Green'
        }
        with self.assertRaises(HTTPBadRequest):
            create_transaction(request)

    def test_get_transaction_by_id_success(self):
        from .wearspace_app.views.api import get_transaction
        # Create a transaction
        transaction_id = uuid.uuid4()
        new_transaction = Transaction(
            id=transaction_id,
            user_id=self.test_user_id,
            product_id=self.test_product_id,
            customer_name="Single Tx",
            shipping_address="Tx Address",
            payment_method="Tx Method",
            purchased_size="M",
            purchased_color="Black",
            transaction_status="Berhasil"
        )
        self.dbsession.add(new_transaction)
        transaction.commit()

        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(transaction_id)
        response = get_transaction(request)
        self._assert_json_response(response, 200, ['id', 'customer_name', 'product', 'user'])
        self.assertEqual(response.json['id'], str(transaction_id))
        self.assertEqual(response.json['customer_name'], "Single Tx")
        self.assertEqual(response.json['product']['id'], str(self.test_product_id))
        self.assertEqual(response.json['user']['id'], str(self.test_user_id))


    def test_get_transaction_by_id_not_found(self):
        from .wearspace_app.views.api import get_transaction
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(uuid.uuid4())
        with self.assertRaises(HTTPNotFound):
            get_transaction(request)

    def test_update_transaction_status_success(self):
        from .wearspace_app.views.api import update_transaction_status
        transaction_id = uuid.uuid4()
        new_transaction = Transaction(
            id=transaction_id,
            user_id=self.test_user_id,
            product_id=self.test_product_id,
            customer_name="Update Tx",
            shipping_address="Update Address",
            payment_method="Update Method",
            purchased_size="M",
            purchased_color="Green",
            transaction_status="Menunggu Pembayaran"
        )
        self.dbsession.add(new_transaction)
        transaction.commit()

        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(transaction_id)
        request.json_body = {'transaction_status': 'Berhasil'}
        response = update_transaction_status(request)
        self._assert_json_response(response, 200, ['id', 'transaction_status'])
        self.assertEqual(response.json['transaction_status'], 'Berhasil')

    def test_update_transaction_status_invalid_status(self):
        from .wearspace_app.views.api import update_transaction_status
        transaction_id = uuid.uuid4()
        new_transaction = Transaction(
            id=transaction_id,
            user_id=self.test_user_id,
            product_id=self.test_product_id,
            customer_name="Update Tx",
            shipping_address="Update Address",
            payment_method="Update Method",
            purchased_size="M",
            purchased_color="Green",
            transaction_status="Menunggu Pembayaran"
        )
        self.dbsession.add(new_transaction)
        transaction.commit()

        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(transaction_id)
        request.json_body = {'transaction_status': 'Invalid Status'}
        with self.assertRaises(HTTPBadRequest):
            update_transaction_status(request)

    def test_delete_transaction_success(self):
        from .wearspace_app.views.api import delete_transaction
        transaction_id = uuid.uuid4()
        new_transaction = Transaction(
            id=transaction_id,
            user_id=self.test_user_id,
            product_id=self.test_product_id,
            customer_name="Delete Tx",
            shipping_address="Delete Address",
            payment_method="Delete Method",
            purchased_size="M",
            purchased_color="Red",
            transaction_status="Dibatalkan"
        )
        self.dbsession.add(new_transaction)
        transaction.commit()

        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(transaction_id)
        response = delete_transaction(request)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.json, {'message': 'Transaction deleted successfully'})
        
        deleted_tx = self.dbsession.query(Transaction).get(transaction_id)
        self.assertIsNone(deleted_tx)

    def test_delete_transaction_not_found(self):
        from .wearspace_app.views.api import delete_transaction
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(uuid.uuid4())
        with self.assertRaises(HTTPNotFound):
            delete_transaction(request)

# --- Favorite API Tests ---
class FavoriteAPITests(BaseTest):
    def test_get_favorites_authenticated_success(self):
        from .wearspace_app.views.api import get_favorites
        # Add a favorite for the test user
        favorite_product_id = uuid.uuid4()
        favorite_product = Product(
            id=favorite_product_id,
            name="Favorite Item",
            brand_id=self.test_brand_id,
            price=50.00,
            stock=5,
            sizes=['XS'],
            colors=['White']
        )
        self.dbsession.add(favorite_product)
        self.dbsession.add(Favorite(user_id=self.test_user_id, product_id=favorite_product_id))
        transaction.commit()

        request = _get_app_request(self.dbsession, userid=self.test_user_id)
        response = get_favorites(request)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)
        self.assertGreaterEqual(len(response.json), 1)
        self.assertEqual(response.json[0]['id'], str(favorite_product_id))
        self.assertEqual(response.json[0]['name'], 'Favorite Item')

    def test_get_favorites_unauthenticated(self):
        from .wearspace_app.views.api import get_favorites
        request = _get_app_request(self.dbsession) # No authenticated user
        with self.assertRaises(HTTPUnauthorized):
            get_favorites(request)

    def test_add_favorite_success(self):
        from .wearspace_app.views.api import add_favorite
        # Create another product to favorite
        new_product_id = uuid.uuid4()
        new_product = Product(
            id=new_product_id,
            name="Another Product",
            brand_id=self.test_brand_id,
            price=25.00,
            stock=10,
            sizes=['M'],
            colors=['Black']
        )
        self.dbsession.add(new_product)
        transaction.commit()

        request = _get_app_request(self.dbsession, userid=self.test_user_id)
        request.json_body = {'product_id': str(new_product_id)}
        response = add_favorite(request)
        self._assert_json_response(response, 201, ['message'])
        self.assertEqual(response.json['message'], 'Product added to favorites')

        # Verify it's in the database
        favorite_entry = self.dbsession.query(Favorite).filter_by(
            user_id=self.test_user_id, product_id=new_product_id
        ).first()
        self.assertIsNotNone(favorite_entry)

    def test_add_favorite_unauthenticated(self):
        from .wearspace_app.views.api import add_favorite
        request = _get_app_request(self.dbsession) # No authenticated user
        request.json_body = {'product_id': str(self.test_product_id)}
        with self.assertRaises(HTTPUnauthorized):
            add_favorite(request)

    def test_add_favorite_product_not_found(self):
        from .wearspace_app.views.api import add_favorite
        request = _get_app_request(self.dbsession, userid=self.test_user_id)
        request.json_body = {'product_id': str(uuid.uuid4())} # Non-existent product
        with self.assertRaises(HTTPNotFound):
            add_favorite(request)

    def test_add_favorite_already_exists(self):
        from .wearspace_app.views.api import add_favorite
        # Add it once
        self.dbsession.add(Favorite(user_id=self.test_user_id, product_id=self.test_product_id))
        transaction.commit()

        request = _get_app_request(self.dbsession, userid=self.test_user_id)
        request.json_body = {'product_id': str(self.test_product_id)}
        with self.assertRaises(HTTPConflict):
            add_favorite(request)

    def test_remove_favorite_success(self):
        from .wearspace_app.views.api import remove_favorite
        # Add a favorite to remove
        self.dbsession.add(Favorite(user_id=self.test_user_id, product_id=self.test_product_id))
        transaction.commit()

        request = _get_app_request(self.dbsession, userid=self.test_user_id)
        request.matchdict['product_id'] = str(self.test_product_id)
        response = remove_favorite(request)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.json, {'message': 'Product removed from favorites'})

        # Verify it's removed
        favorite_entry = self.dbsession.query(Favorite).filter_by(
            user_id=self.test_user_id, product_id=self.test_product_id
        ).first()
        self.assertIsNone(favorite_entry)

    def test_remove_favorite_unauthenticated(self):
        from .wearspace_app.views.api import remove_favorite
        request = _get_app_request(self.dbsession) # No authenticated user
        request.matchdict['product_id'] = str(self.test_product_id)
        with self.assertRaises(HTTPUnauthorized):
            remove_favorite(request)

    def test_remove_favorite_not_found(self):
        from .wearspace_app.views.api import remove_favorite
        request = _get_app_request(self.dbsession, userid=self.test_user_id)
        request.matchdict['product_id'] = str(uuid.uuid4()) # Non-existent favorite
        with self.assertRaises(HTTPNotFound):
            remove_favorite(request)

# --- Inspiration API Tests ---
class InspirationAPITests(BaseTest):
    def test_get_inspirations_success(self):
        from .wearspace_app.views.api import get_inspirations
        request = _get_app_request(self.dbsession)
        response = get_inspirations(request)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)
        self.assertGreaterEqual(len(response.json), 1)
        self.assertEqual(response.json[0]['title'], self.test_inspiration.title)

    def test_get_inspirations_with_tag_filter(self):
        from .wearspace_app.views.api import get_inspirations
        # Add another inspiration with a specific tag
        inspo2_id = uuid.uuid4()
        inspo2 = Inspiration(
            id=inspo2_id,
            title="Winter Looks",
            description="Cozy winter outfits",
            image_url="http://example.com/winter.jpg",
            tag="Winter,Fashion"
        )
        self.dbsession.add(inspo2)
        transaction.commit()

        request = _get_app_request(self.dbsession)
        request.params = MultiDict([('tag', 'fashion')]) # Case-insensitive search
        response = get_inspirations(request)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)
        self.assertGreaterEqual(len(response.json), 1)
        # Check if both inspirations are returned because 'fashion' matches 'Test,Inspire' and 'Winter,Fashion'
        self.assertTrue(any('Test Inspiration' == i['title'] for i in response.json))
        self.assertTrue(any('Winter Looks' == i['title'] for i in response.json))
        
        request.params = MultiDict([('tag', 'winter')])
        response = get_inspirations(request)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)
        self.assertEqual(len(response.json), 1)
        self.assertEqual(response.json[0]['title'], 'Winter Looks')


    def test_create_inspiration_success(self):
        from .wearspace_app.views.api import create_inspiration
        request = _get_app_request(self.dbsession)
        request.json_body = {
            'title': 'New Inspiration',
            'description': 'A new inspiring piece.',
            'image_url': 'http://example.com/new_inspo.jpg',
            'tag': 'New,Ideas'
        }
        response = create_inspiration(request)
        self._assert_json_response(response, 201, ['id', 'title'])
        self.assertEqual(response.json['title'], 'New Inspiration')

    def test_create_inspiration_missing_fields(self):
        from .wearspace_app.views.api import create_inspiration
        request = _get_app_request(self.dbsession)
        request.json_body = {'title': 'Incomplete'} # Missing other required fields
        with self.assertRaises(HTTPBadRequest):
            create_inspiration(request)

    def test_get_inspiration_by_id_success(self):
        from .wearspace_app.views.api import get_inspiration
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_inspiration_id)
        response = get_inspiration(request)
        self._assert_json_response(response, 200, ['id', 'title'])
        self.assertEqual(response.json['id'], str(self.test_inspiration_id))
        self.assertEqual(response.json['title'], self.test_inspiration.title)

    def test_get_inspiration_by_id_not_found(self):
        from .wearspace_app.views.api import get_inspiration
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(uuid.uuid4())
        with self.assertRaises(HTTPNotFound):
            get_inspiration(request)

    def test_update_inspiration_success(self):
        from .wearspace_app.views.api import update_inspiration
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_inspiration_id)
        request.json_body = {
            'description': 'Updated inspiration content',
            'tag': 'Updated,Tags'
        }
        response = update_inspiration(request)
        self._assert_json_response(response, 200, ['id', 'description', 'tag'])
        self.assertEqual(response.json['description'], 'Updated inspiration content')
        self.assertEqual(response.json['tag'], 'Updated,Tags')

    def test_delete_inspiration_success(self):
        from .wearspace_app.views.api import delete_inspiration
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(self.test_inspiration_id)
        response = delete_inspiration(request)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.json, {'message': 'Inspiration deleted successfully'})
        
        deleted_inspo = self.dbsession.query(Inspiration).get(self.test_inspiration_id)
        self.assertIsNone(deleted_inspo)

    def test_delete_inspiration_not_found(self):
        from .wearspace_app.views.api import delete_inspiration
        request = _get_app_request(self.dbsession)
        request.matchdict['id'] = str(uuid.uuid4())
        with self.assertRaises(HTTPNotFound):
            delete_inspiration(request)