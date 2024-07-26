from django.http import HttpResponse

# views that manage API requests and responses
def api(request):
	return HttpResponse("API online")
