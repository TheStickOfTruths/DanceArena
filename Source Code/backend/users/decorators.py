from django.http import HttpResponseForbidden
from functools import wraps

def role_required(allowed_roles):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return HttpResponseForbidden("Moras se ulogirati!")
            if request.user.role not in allowed_roles:
                return HttpResponseForbidden("Nemas dopustenje!")
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator