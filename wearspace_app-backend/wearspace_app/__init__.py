from pyramid.config import Configurator
from pyramid.session import SignedCookieSessionFactory
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from sqlalchemy import engine_from_config
from .models.meta import Base
from .models import User # Import User model untuk callback auth
from pyramid.renderers import JSON
from .cors import cors_tween_factory
import uuid # Diperlukan untuk get_user_principals

# Callback untuk AuthTktAuthenticationPolicy
def get_user_principals(userid, request):
    # userid adalah string user ID yang disimpan di ticket
    try:
        user_uuid = uuid.UUID(userid)
        user = request.dbsession.query(User).get(user_uuid)
        if user:
            # Mengembalikan list principals. Contoh: ['user:{user_id}', 'group:users']
            # Untuk kasus sederhana, kita hanya mengembalikan user ID sebagai principal
            return [f'user:{user.id}']
        return None
    except ValueError:
        return None # Handle jika userid bukan UUID yang valid

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application. """

    config = Configurator(settings=settings)

    # 1. Konfigurasi CORS (harus di awal)
    config.add_tween('.cors_tween_factory')
    config.add_renderer('json', JSON(indent=4))

    # 2. Konfigurasi Session Factory (AuthTkt policy membutuhkan ini)
    session_secret = settings.get('session.secret', 'a_default_session_secret_for_dev') # Ganti dengan secret kuat
    session_factory = SignedCookieSessionFactory(session_secret)
    config.set_session_factory(session_factory)

    # 3. Konfigurasi Authentication dan Authorization Policy
    auth_secret = settings.get('auth.secret', 'a_default_auth_secret_for_dev') # Ganti dengan secret kuat
    authn_policy = AuthTktAuthenticationPolicy(
        auth_secret,
        callback=get_user_principals,
        hashalg='sha512',
        cookie_name='wearspace_auth',
        # secure=True, # Aktifkan di produksi dengan HTTPS
        # httponly=True, # Pastikan ini True untuk keamanan cookie
        # wildcard_domain=False # Aktifkan jika aplikasi di subdomain berbeda
    )
    authz_policy = ACLAuthorizationPolicy()

    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

    # 4. Include other Pyramid extensions/modules
    config.include('pyramid_jinja2')
    # `pyramid_sqlalchemy` harus di-include sebelum `.models`
    # karena `.models` mungkin bergantung pada konfigurasi SQLAlchemy dari `pyramid_sqlalchemy`
    config.include('pyramid_sqlalchemy') # Ini akan mengatur dbsession dan engine
    config.include('pyramid_tm')
    config.include('pyramid_retry')

    # 5. Include your application's models and routes
    config.include('.models') # Ini akan memanggil includeme dari wearspace_app/models/__init__.py
    config.include('.routes') # Ini akan memanggil includeme dari wearspace_app/routes.py

    # 6. Scan views and other declaratively configured components
    config.scan()

    return config.make_wsgi_app()