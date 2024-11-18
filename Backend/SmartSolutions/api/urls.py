from django.urls import path

from . import views

urlpatterns = [
    path("", views.api),
    path("data/main", views.main),
    path("data/stats", views.stats),
    path("data/demand", views.demand),
    path("data/battery", views.battery),
    path("analysis", views.analysis),
    path("analysis/correlations", views.correlations),  
    path("insights/forecast", views.forecast),
]