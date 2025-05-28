import uuid
from pyramid.view import view_config
from pyramid.response import Response
from webob.exc import HTTPNotFound, HTTPBadRequest, HTTPInternalServerError, HTTPUnauthorized, HTTPConflict
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from ...models import (
    User, Brand, Product, Transaction, Favorite, Inspiration
)
from ...models.meta import UUIDColumn # Pastikan ini benar
from pyramid.security import remember, forget # Hapus authenticated_userid dari sini
from datetime import datetime
from decimal import Decimal

# Helper: validasi field kosong
def require_fields(data, required_fields):
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        # Langsung raise exception HTTP
        raise HTTPBadRequest(json={'error': f'Missing fields: {", ".join(missing)}'})

# Helper: Serialisasi objek
def serialize_object(obj):
    if not obj:
        return None
    data = {c.name: getattr(obj, c.name) for c in obj.__table__.columns}
    for key, value in data.items():
        if isinstance(value, uuid.UUID):
            data[key] = str(value)
        elif isinstance(value, datetime):
            if value:
                data[key] = value.isoformat()
        elif isinstance(value, Decimal):
            data[key] = float(value)
    if 'hashed_password' in data: # Hapus hashed_password untuk keamanan
        del data['hashed_password']
    return data

# --- Authentication and User Management ---

@view_config(route_name='register', request_method='POST', renderer='json')
def register_user(request):
    data = request.json_body
    
    try:
        require_fields(data, ['email', 'password'])
    except HTTPBadRequest as e: # Tangkap exception yang di-raise helper
        raise e

    email = data['email']
    password = data['password']

    try:
        existing_user = request.dbsession.query(User).filter_by(email=email).first()
        if existing_user:
            raise HTTPConflict(json={'error': 'User with this email already exists.'}) # Gunakan HTTPConflict

        user = User(email=email)
        user.set_password(password)
        user.phone = data.get('phone')
        user.address = data.get('address')
        user.username = data.get('username') # Pastikan username juga ditambahkan jika ada di model User

        request.dbsession.add(user)
        request.dbsession.flush()
        return Response(json={'message': 'User registered successfully!', 'user': serialize_object(user)}, status=201)
    except IntegrityError:
        request.dbsession.rollback()
        # Jika ada unique constraint lain selain email, bisa juga tertangkap di sini
        raise HTTPBadRequest(json={'error': 'User with this email already exists or other integrity error.'})
    except HTTPConflict as e: # Tangkap HTTPConflict yang kita raise
        raise e
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPInternalServerError(f'Failed to register user: {e}')

@view_config(route_name='login', request_method='POST', renderer='json')
def login_user(request):
    data = request.json_body

    try:
        require_fields(data, ['email', 'password'])
    except HTTPBadRequest as e:
        raise e

    email = data['email']
    password = data['password']

    user = request.dbsession.query(User).filter_by(email=email).first()
    if not user or not user.check_password(password):
        raise HTTPUnauthorized(json={'error': 'Invalid credentials.'})

    # Membuat cookie autentikasi AuthTkt
    # user.id harus berupa string karena itu yang diharapkan oleh AuthTktAuthenticationPolicy
    headers = remember(request, str(user.id))

    response = Response(json={
        'message': 'Login successful!',
        'user': serialize_object(user),
        # Opsional: untuk verifikasi di sisi klien bahwa user terautentikasi
        'authenticated_userid': request.authenticated_userid # Gunakan request.authenticated_userid
    })
    response.headers.extend(headers) # Menambahkan header Set-Cookie ke response
    return response

@view_config(route_name='logout', request_method='POST', renderer='json')
def logout_user(request):
    # Menghapus cookie autentikasi AuthTkt
    headers = forget(request)
    response = Response(json={'message': 'Logged out successfully.'})
    response.headers.extend(headers) # Menambahkan header untuk menghapus cookie ke response
    return response

@view_config(route_name='users', request_method='GET', renderer='json')
def get_users(request):
    users = request.dbsession.query(User).all()
    return [serialize_object(user) for user in users]

@view_config(route_name='user_by_id', request_method='GET', renderer='json')
def get_user(request):
    user_id = request.matchdict['id']
    try:
        user = request.dbsession.query(User).get(uuid.UUID(user_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for user ID.'})
    if not user:
        raise HTTPNotFound(json={'error': 'User not found.'})
    return serialize_object(user)

@view_config(route_name='user_by_id', request_method='PUT', renderer='json')
def update_user(request):
    user_id = request.matchdict['id']
    data = request.json_body
    try:
        user = request.dbsession.query(User).get(uuid.UUID(user_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for user ID.'})
    if not user:
        raise HTTPNotFound(json={'error': 'User not found.'})

    try:
        if 'password' in data:
            user.set_password(data['password'])
            del data['password'] # Hapus password dari data agar tidak di-setattr lagi

        for key, value in data.items():
            if hasattr(user, key):
                setattr(user, key, value)
        request.dbsession.flush()
        return serialize_object(user)
    except IntegrityError:
        request.dbsession.rollback()
        raise HTTPConflict(json={'error': 'Email already in use or other integrity error.'}) # Gunakan HTTPConflict
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPInternalServerError(f'Failed to update user: {e}')

@view_config(route_name='user_by_id', request_method='DELETE', renderer='json')
def delete_user(request):
    user_id = request.matchdict['id']
    try:
        user = request.dbsession.query(User).get(uuid.UUID(user_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for user ID.'})
    if not user:
        raise HTTPNotFound(json={'error': 'User not found.'})

    request.dbsession.delete(user)
    return Response(json={'message': 'User deleted successfully'}, status=200)

# --- Brand Management ---

@view_config(route_name='brands', request_method='GET', renderer='json')
def get_brands(request):
    brands = request.dbsession.query(Brand).all()
    return [serialize_object(brand) for brand in brands]

@view_config(route_name='brands', request_method='POST', renderer='json')
def create_brand(request):
    data = request.json_body
    try:
        require_fields(data, ['name'])
    except HTTPBadRequest as e:
        raise e

    try:
        brand = Brand(name=data['name'])
        request.dbsession.add(brand)
        request.dbsession.flush()
        return Response(json=serialize_object(brand), status=201)
    except IntegrityError:
        request.dbsession.rollback()
        raise HTTPConflict(json={'error': 'Brand with this name already exists.'}) # Gunakan HTTPConflict
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPInternalServerError(f'Failed to create brand: {e}')

@view_config(route_name='brand_by_id', request_method='PUT', renderer='json')
def update_brand(request):
    brand_id = request.matchdict['id']
    data = request.json_body
    try:
        brand = request.dbsession.query(Brand).get(uuid.UUID(brand_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for brand ID.'})
    if not brand:
        raise HTTPNotFound(json={'error': 'Brand not found.'})

    try:
        if 'name' in data:
            brand.name = data['name']
        request.dbsession.flush()
        return serialize_object(brand)
    except IntegrityError:
        request.dbsession.rollback()
        raise HTTPConflict(json={'error': 'Brand name already exists.'}) # Gunakan HTTPConflict
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPInternalServerError(f'Failed to update brand: {e}')

@view_config(route_name='brand_by_id', request_method='DELETE', renderer='json')
def delete_brand(request):
    brand_id = request.matchdict['id']
    try:
        brand = request.dbsession.query(Brand).get(uuid.UUID(brand_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for brand ID.'})
    if not brand:
        raise HTTPNotFound(json={'error': 'Brand not found.'})

    request.dbsession.delete(brand)
    return Response(json={'message': 'Brand deleted successfully'}, status=200)

# --- Product Management ---

@view_config(route_name='products', request_method='GET', renderer='json')
def get_products(request):
    products = request.dbsession.query(Product).all()
    return [serialize_object(p) for p in products]

@view_config(route_name='products', request_method='POST', renderer='json')
def create_product(request):
    data = request.json_body
    required_fields = ['name', 'brand_id', 'price', 'stock', 'sizes', 'colors']
    
    try:
        require_fields(data, required_fields)
    except HTTPBadRequest as e:
        raise e

    try:
        brand_id_uuid = uuid.UUID(data['brand_id'])
        brand = request.dbsession.query(Brand).get(brand_id_uuid)
        if not brand:
            raise HTTPBadRequest(json={'error': 'Brand not found for the given brand_id.'})

        product = Product(
            name=data['name'],
            brand_id=brand_id_uuid,
            price=data['price'],
            stock=data['stock'],
            sizes=data['sizes'],
            colors=data['colors'],
            description=data.get('description'),
            image_url=data.get('image_url'),
            material=data.get('material'),
            category=data.get('category')
        )
        request.dbsession.add(product)
        request.dbsession.flush()
        return Response(json=serialize_object(product), status=201)
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for brand ID.'})
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPInternalServerError(f'Failed to create product: {e}')

@view_config(route_name='product_by_id', request_method='GET', renderer='json')
def get_product(request):
    product_id = request.matchdict['id']
    try:
        product = request.dbsession.query(Product).get(uuid.UUID(product_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for product ID.'})
    if not product:
        raise HTTPNotFound(json={'error': 'Product not found.'})
    return serialize_object(product)

@view_config(route_name='product_by_id', request_method='PUT', renderer='json')
def update_product(request):
    product_id = request.matchdict['id']
    data = request.json_body
    try:
        product = request.dbsession.query(Product).get(uuid.UUID(product_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for product ID.'})
    if not product:
        raise HTTPNotFound(json={'error': 'Product not found.'})

    try:
        if 'brand_id' in data:
            brand_id_uuid = uuid.UUID(data['brand_id'])
            brand = request.dbsession.query(Brand).get(brand_id_uuid)
            if not brand:
                raise HTTPBadRequest(json={'error': 'Brand not found for the given brand_id.'})
            product.brand_id = brand_id_uuid

        for key, value in data.items():
            if key not in ['brand_id'] and hasattr(product, key):
                setattr(product, key, value)

        request.dbsession.flush()
        return serialize_object(product)
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format provided.'})
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPInternalServerError(f'Failed to update product: {e}')

@view_config(route_name='product_by_id', request_method='DELETE', renderer='json')
def delete_product(request):
    product_id = request.matchdict['id']
    try:
        product = request.dbsession.query(Product).get(uuid.UUID(product_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for product ID.'})
    if not product:
        raise HTTPNotFound(json={'error': 'Product not found.'})

    request.dbsession.delete(product)
    return Response(json={'message': 'Product deleted successfully'}, status=200)

# --- Transaction Management ---
@view_config(route_name='transactions', request_method='GET', renderer='json')
def get_transactions(request):
    transactions = request.dbsession.query(Transaction).all()
    serialized_transactions = []
    for t in transactions:
        t_data = serialize_object(t)
        if t.product:
            t_data['product'] = serialize_object(t.product)
        if t.user:
            t_data['user'] = serialize_object(t.user)
        serialized_transactions.append(t_data)
    return serialized_transactions

@view_config(route_name='transactions', request_method='POST', renderer='json')
def create_transaction(request):
    data = request.json_body
    required_fields = ['product_id', 'customer_name', 'shipping_address',
                       'payment_method', 'purchased_size', 'purchased_color']
    
    try:
        require_fields(data, required_fields)
    except HTTPBadRequest as e:
        raise e

    try:
        product_id_uuid = uuid.UUID(data['product_id'])
        product = request.dbsession.query(Product).get(product_id_uuid)
        if not product:
            raise HTTPBadRequest(json={'error': 'Product not found.'})

        if product.stock <= 0:
            raise HTTPBadRequest(json={'error': 'Product out of stock.'})

        product.stock -= 1

        user_id = None
        # Gunakan request.authenticated_userid untuk mendapatkan ID pengguna yang sedang login
        if request.authenticated_userid:
            user_id = uuid.UUID(request.authenticated_userid)

        transaction = Transaction(
            user_id=user_id, # user_id bisa None jika tidak ada yang login
            product_id=product_id_uuid,
            customer_name=data['customer_name'],
            shipping_address=data['shipping_address'],
            payment_method=data['payment_method'],
            purchased_size=data['purchased_size'],
            purchased_color=data['purchased_color'],
            transaction_status='Menunggu Pembayaran'
        )
        request.dbsession.add(transaction)
        request.dbsession.flush()

        return Response(json=serialize_object(transaction), status=201)
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format.'})
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPInternalServerError(f'Failed to create transaction: {e}')

@view_config(route_name='transaction_by_id', request_method='GET', renderer='json')
def get_transaction(request):
    transaction_id = request.matchdict['id']
    try:
        transaction = request.dbsession.query(Transaction).get(uuid.UUID(transaction_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for transaction ID.'})
    if not transaction:
        raise HTTPNotFound(json={'error': 'Transaction not found.'})

    t_data = serialize_object(transaction)
    if transaction.product:
        t_data['product'] = serialize_object(transaction.product)
    if transaction.user:
        t_data['user'] = serialize_object(transaction.user)
    return t_data

@view_config(route_name='transaction_by_id', request_method='PUT', renderer='json')
def update_transaction_status(request):
    transaction_id = request.matchdict['id']
    data = request.json_body
    if 'transaction_status' not in data:
        raise HTTPBadRequest(json={'error': 'Transaction status is required for update.'})

    try:
        transaction = request.dbsession.query(Transaction).get(uuid.UUID(transaction_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for transaction ID.'})
    if not transaction:
        raise HTTPNotFound(json={'error': 'Transaction not found.'})

    valid_statuses = ['Menunggu Pembayaran', 'Berhasil', 'Dibatalkan']
    if data['transaction_status'] not in valid_statuses:
        raise HTTPBadRequest(json={'error': f"Invalid status. Must be one of: {', '.join(valid_statuses)}"})

    try:
        transaction.transaction_status = data['transaction_status']
        request.dbsession.flush()
        return serialize_object(transaction)
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPInternalServerError(f'Failed to update transaction status: {e}')

@view_config(route_name='transaction_by_id', request_method='DELETE', renderer='json')
def delete_transaction(request):
    transaction_id = request.matchdict['id']
    try:
        transaction = request.dbsession.query(Transaction).get(uuid.UUID(transaction_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for transaction ID.'})
    if not transaction:
        raise HTTPNotFound(json={'error': 'Transaction not found.'})

    request.dbsession.delete(transaction)
    # Perubahan di sini: Ubah status menjadi 200 OK
    return Response(json={'message': 'Transaction deleted successfully'}, status=200) # Ganti 200 jadi 200

# --- Favorite Management ---

@view_config(route_name='favorites', request_method='GET', renderer='json')
def get_favorites(request):
    # Mengambil ID pengguna yang sedang login
    user_id = request.authenticated_userid # Langsung pakai request.authenticated_userid
    if not user_id:
        raise HTTPUnauthorized(json={'error': 'Authentication required to view favorites.'})

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for user ID in session.'})

    favorites = request.dbsession.query(Favorite).filter(Favorite.user_id == user_uuid).all()
    favorite_products = []
    for fav in favorites:
        if fav.product:
            favorite_products.append(serialize_object(fav.product))
    return favorite_products

@view_config(route_name='favorites', request_method='POST', renderer='json')
def add_favorite(request):
    # Mengambil ID pengguna yang sedang login
    user_id = request.authenticated_userid # Langsung pakai request.authenticated_userid
    if not user_id:
        raise HTTPUnauthorized(json={'error': 'Authentication required to add favorite.'})

    data = request.json_body
    try:
        require_fields(data, ['product_id'])
    except HTTPBadRequest as e:
        raise e

    try:
        user_uuid = uuid.UUID(user_id)
        product_uuid = uuid.UUID(data['product_id'])

        user = request.dbsession.query(User).get(user_uuid)
        product = request.dbsession.query(Product).get(product_uuid)
        if not user or not product:
            raise HTTPNotFound(json={'error': 'User or Product not found.'})

        existing_favorite = request.dbsession.query(Favorite).filter_by(
            user_id=user_uuid, product_id=product_uuid
        ).first()
        if existing_favorite:
            raise HTTPConflict(json={'error': 'Product already in favorites.'})

        favorite = Favorite(user_id=user_uuid, product_id=product_uuid)
        request.dbsession.add(favorite)
        request.dbsession.flush()
        return Response(json={'message': 'Product added to favorites'}, status=201)
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format.'})
    except IntegrityError:
        request.dbsession.rollback()
        # Jika ada unique constraint di database, ini akan terpicu
        raise HTTPConflict(json={'error': 'Product already in favorites (integrity constraint).'})
    except HTTPConflict as e: # Tangkap HTTPConflict yang kita raise
        raise e
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPInternalServerError(f'Failed to add favorite: {e}')

@view_config(route_name='favorite_by_product_id', request_method='DELETE', renderer='json')
def remove_favorite(request):
    # Mengambil ID pengguna yang sedang login
    user_id = request.authenticated_userid # Langsung pakai request.authenticated_userid
    if not user_id:
        raise HTTPUnauthorized(json={'error': 'Authentication required to remove favorite.'})

    product_id = request.matchdict['product_id']
    try:
        user_uuid = uuid.UUID(user_id)
        product_uuid = uuid.UUID(product_id)
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format.'})

    favorite = request.dbsession.query(Favorite).filter_by(
        user_id=user_uuid, product_id=product_uuid
    ).first()
    if not favorite:
        raise HTTPNotFound(json={'error': 'Favorite not found.'})

    request.dbsession.delete(favorite)
    return Response(json={'message': 'Product removed from favorites'}, status=200)

# --- Inspiration Management ---

@view_config(route_name='inspirations', request_method='GET', renderer='json')
def get_inspirations(request):
    tag = request.params.get('tag')
    query = request.dbsession.query(Inspiration)
    if tag:
        query = query.filter(Inspiration.tag.ilike(f'%{tag}%'))
    inspirations = query.all()
    return [serialize_object(inspo) for inspo in inspirations]

@view_config(route_name='inspirations', request_method='POST', renderer='json')
def create_inspiration(request):
    data = request.json_body
    required_fields = ['title', 'description', 'image_url', 'tag']
    
    try:
        require_fields(data, required_fields)
    except HTTPBadRequest as e:
        raise e

    try:
        inspiration = Inspiration(
            title=data['title'],
            description=data['description'],
            image_url=data['image_url'],
            tag=data['tag']
        )
        request.dbsession.add(inspiration)
        request.dbsession.flush()
        return Response(json=serialize_object(inspiration), status=201)
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPInternalServerError(f'Failed to create inspiration: {e}')

@view_config(route_name='inspiration_by_id', request_method='GET', renderer='json')
def get_inspiration(request):
    inspiration_id = request.matchdict['id']
    try:
        inspiration = request.dbsession.query(Inspiration).get(uuid.UUID(inspiration_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for inspiration ID.'})
    if not inspiration:
        raise HTTPNotFound(json={'error': 'Inspiration not found.'})
    return serialize_object(inspiration)

@view_config(route_name='inspiration_by_id', request_method='PUT', renderer='json')
def update_inspiration(request):
    inspiration_id = request.matchdict['id']
    data = request.json_body
    try:
        inspiration = request.dbsession.query(Inspiration).get(uuid.UUID(inspiration_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for inspiration ID.'})
    if not inspiration:
        raise HTTPNotFound(json={'error': 'Inspiration not found.'})

    try:
        for key, value in data.items():
            if hasattr(inspiration, key):
                setattr(inspiration, key, value)
        request.dbsession.flush()
        return serialize_object(inspiration)
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPInternalServerError(f'Failed to update inspiration: {e}')

@view_config(route_name='inspiration_by_id', request_method='DELETE', renderer='json')
def delete_inspiration(request):
    inspiration_id = request.matchdict['id']
    try:
        inspiration = request.dbsession.query(Inspiration).get(uuid.UUID(inspiration_id))
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Invalid UUID format for inspiration ID.'})
    if not inspiration:
        raise HTTPNotFound(json={'error': 'Inspiration not found.'})

    request.dbsession.delete(inspiration)
    return Response(json={'message': 'Inspiration deleted successfully'}, status=200)