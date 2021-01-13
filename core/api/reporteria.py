from rest_framework.views import APIView
from django.db import connection
from rest_framework import status
from django.db import connection
from django.http import HttpResponse
from django.conf import settings
import json



class TOP_3_TIPO_PROBLEMA(APIView):

    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE TOP_3_TIPO_PROBLEMA  @COD_USUARIO = {pk}")
        arr = []
        for x in cursor:
            arr.append({'y':x[0],'name':x[1]})
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)

class TOP_3_TIPO_CONTRATO(APIView):

    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE TOP_3_TIPO_CONTRATO @COD_USUARIO = {pk}")
        arr = []
        for x in cursor:
            arr.append({'y':x[0],'name':x[1]})
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)

class TOP_TIPO_CONTRATO(APIView):

    def get(self, request, format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"SELECT COUNT(*) , TIPO_CONTRATO  FROM CONTRATO GROUP BY TIPO_CONTRATO")
        arr = []
        for x in cursor:
            arr.append({'y':x[0],'name':x[1]})
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)

class TOP_TIPO_PROBLEMA(APIView):

    def get(self, request,format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"SELECT  COUNT(*) AS 'TOTAL' , TIPO_PROBLEMA FROM TICKET GROUP BY TIPO_PROBLEMA")
        arr = []
        for x in cursor:
            arr.append({'y':x[0],'name':x[1]})
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)




