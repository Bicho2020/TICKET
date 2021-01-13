from rest_framework.views import APIView
from django.db import connection
from rest_framework import status
from django.db import connection
from django.http import HttpResponse
from django.conf import settings
import json

class Estado(APIView):
    def post(self, request, format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute("DELETE FROM ESTADO")
        SQL_BASE = "INSERT INTO ESTADO (ESTADO_DESCRIPCION,COD_OPERACION,ENVIAR_CORREO,ES_ESCALADO,CODIGO_SAP) VALUES"
        s = ""
        for x in request.data:
            s+= (f"('{x['NOMBRE']}','{x['OPERACION']}',{x['ENVIAR_CORREO']},{x['ES_ESCALABLE']},'{x['CODIGO_SAP']}'),")
        s = s[:-1]
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(SQL_BASE+s)
        return HttpResponse(json.dumps('GUARDADO').encode('utf8'), status=status.HTTP_200_OK)

    def get(self, request, format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute("LISTAR_ESTADO_ACTUAL")
        var = []
        for x in cursor:
            var.append({'COD_ESTADO':x[0],
            'ESTADO_NOMBRE': x[1],
            'COD_OPERACION':x[2],
            'OPERACION':x[3],
            'ENVIAR_CORREO':x[4],
            'ES_ESCALADO':x[5],
            'CODIGO_SAP':x[6]})
        return HttpResponse(json.dumps(var).encode('utf8'), status=status.HTTP_200_OK)

