from rest_framework.views import APIView
from django.db import connection
from rest_framework import status
from django.db import connection
from django.http import HttpResponse
from django.conf import settings
import json

class ROLES(APIView):

    def get(self, request, format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"SELECT COD_ROL , DESCRIPCION FROM ROL WHERE COD_ROL <> 1 AND COD_ROL <> 2 AND COD_ROL <> 3")
        arr = []
        for x in cursor:
            arr.append({'COD_ROL':x[0],'NOMBRE':x[1]})
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)

    def post(self, request, format=None):
        data = request.data
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"INSERT INTO ROL VALUES ('{data['NOMBRE_ROL']}')")
        
        return HttpResponse(json.dumps('GUARDADO').encode('utf8'), status=status.HTTP_200_OK)

class ROLES_ELIMINAR(APIView):

    def delete(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"DELETE ROL WHERE COD_ROL = {pk}")
        return HttpResponse(json.dumps('ELIMINADO').encode('utf8'), status=status.HTTP_200_OK)


class LISTAR_COD_SAP_SEGUN_ROL_SOPORTE_AREA(APIView):
    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"SELECT CODIGO_SAP FROM ESTADO WHERE COD_OPERACION = {pk} AND ES_ESCALADO = 1")
        COD_SAP = ''
        for x in cursor:
            COD_SAP = x[0]
        return HttpResponse(json.dumps(COD_SAP).encode('utf8'), status=status.HTTP_200_OK)

class SELECCIONAR_ROL_USUARIO(APIView):
    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"SELECT DESCRIPCION FROM ROL WHERE COD_ROL = {pk}")
        ROL = ''
        for x in cursor:
            ROL = x[0]
        return HttpResponse(json.dumps(ROL).encode('utf8'), status=status.HTTP_200_OK)



