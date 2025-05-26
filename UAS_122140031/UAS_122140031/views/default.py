from pyramid.view import view_config


@view_config(route_name='home', renderer='UAS_122140031:templates/mytemplate.jinja2')
def my_view(request):
    return {'project': 'UAS_122140031'}
