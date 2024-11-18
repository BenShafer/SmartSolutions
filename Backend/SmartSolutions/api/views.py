from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
import pandas as pd
from .services import manager as ma
import json


# views that manage API requests and responses
def api(request):
	return HttpResponse("API online")

def main(request):
	if request.method == 'POST':
		data = JSONParser().parse(request)
		print(data)
		df = ma.get_main_data(span=data.get('span'))
		print(df.head(), df.tail(3))
		return JsonResponse(df.to_json(orient='records', date_format='iso'), safe=False)

def stats(request):
	if request.method == 'POST':
		data = JSONParser().parse(request)
		print(data)
		df = ma.get_kwh_costs(start_date=data.get('start_date'), end_date=data.get('end_date'))
		return JsonResponse(df.to_json(orient='records'), safe=False)
	
def demand(request):
	if request.method == 'POST':
		data = JSONParser().parse(request)
		demand = ma.get_demand_cost(date=data.get('start_date'))
		return JsonResponse(json.dumps(demand), safe=False)

def battery(request):
	if request.method == 'POST':
		data = JSONParser().parse(request)
		print(data)
		savings = ma.get_battery_savings(start_date=data.get('start_date'), end_date=data.get('end_date'), battery_size=data.get('battery_size'))
		print(savings)
		return JsonResponse(json.dumps(savings), safe=False)

def analysis(request):
	print(request)
	return JsonResponse(ma.get_all_vars(), safe=False)

def correlations(request):
	if request.method == 'POST':
		data = JSONParser().parse(request)
		corr_matrix = ma.get_corrs(data)
		return JsonResponse(corr_matrix.to_json(orient='split'), safe=False)

def forecast(request):
	if request.method == 'POST':
		data = JSONParser().parse(request)
		forecast = ma.predict_1_week_TFT(start_date=data.get('start_date'))
		return JsonResponse(forecast.to_json(orient='records'), safe=False)