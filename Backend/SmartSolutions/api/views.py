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