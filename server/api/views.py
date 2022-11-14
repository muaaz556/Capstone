from django.http import HttpResponse

def index(request):
    return HttpResponse("HTTP Response for index() views.")
