# wearspace_app/routes.py
def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')

    # API Routes for Users
    config.add_route('users', '/api/users')
    config.add_route('user_by_id', '/api/users/{id}')

    # --- API Routes for Auth (TAMBAHKAN INI) ---
    config.add_route('register', '/api/auth/register')
    config.add_route('login', '/api/auth/login')
    config.add_route('logout', '/api/auth/logout')
    # --------------------------------------------

    # API Routes for Brands
    config.add_route('brands', '/api/brands')
    config.add_route('brand_by_id', '/api/brands/{id}')

    # API Routes for Products
    config.add_route('products', '/api/products')
    config.add_route('product_by_id', '/api/products/{id}')

    # API Routes for Transactions
    config.add_route('transactions', '/api/transactions')
    config.add_route('transaction_by_id', '/api/transactions/{id}')

    # API Routes for Favorites
    config.add_route('favorites', '/api/favorites')
    config.add_route('favorite_by_product_id', '/api/favorites/{product_id}')

    # API Routes for Inspirations
    config.add_route('inspirations', '/api/inspirations')
    config.add_route('inspiration_by_id', '/api/inspirations/{id}')