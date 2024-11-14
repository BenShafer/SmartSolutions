from django.apps import AppConfig


class ApiConfig(AppConfig):
    # default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        from .services.data.loader import load_global_data
        load_global_data()
