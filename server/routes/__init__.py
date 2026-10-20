from .auth import auth_bp
from .citizens import citizens_bp
from .categories import categories_bp
from .service_requests import service_requests_bp

__all__ = [
    "auth_bp",
    "citizens_bp",
    "categories_bp",
    "service_requests_bp",
]