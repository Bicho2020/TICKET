from django.db import connection
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core import serializers
from django.http import HttpResponse
from django.conf import settings
from django.core.files.storage import FileSystemStorage
import json

class FiltrarMSJ(APIView):
    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query  = cursor.execute(f"EXECUTE LISTAR_MENSAJES @COD_TICKET = {pk}")
        arr = []
        for x in query:
            arr.append(
                {'COD_MENSAJE':x[0],
                'COD_TICKET':x[1],
                'USUARIO':x[2],
                'FECHA':x[3],
                'HORA_MENSAJE':str(x[4]),
                'COMENTARIO':x[5],
                'VISTO':x[6],
                'CODIGO_USUARIO':x[7],
                'ADJUNTO':x[8]
            })  
          
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)

class NotificacionesSoporte(APIView):
    def get(self, request, pk , eT, format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query  = cursor.execute(f"EXECUTE SOLICITUDES_PENDIENTES_SOPORTE @COD_USUARIO = {pk} , @COD_ESTADO = {eT}")
        var = ''
        for x in query:
            var = x[0]  
        return HttpResponse(json.dumps(var).encode('utf8'),status=status.HTTP_200_OK)

class MensajesSinVerSoporte(APIView):
    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query  = cursor.execute(f"EXECUTE MENSAJES_SIN_VER_SOPORTE @COD_USUARIO = {pk}")
        var = ''
        for x in query:
            var = x[0]  
        return HttpResponse(json.dumps(var).encode('utf8'),status=status.HTTP_200_OK)

class MensajesSinVerCLIENTE(APIView):
    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query  = cursor.execute(f"EXECUTE MENSAJES_SIN_VER_CLIENTE @COD_USUARIO = {pk}")
        var = ''
        for x in query:
            var = x[0]  
        return HttpResponse(json.dumps(var).encode('utf8'),status=status.HTTP_200_OK)


class MensajesSinVerXsolicitud(APIView):
    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query  = cursor.execute(f"EXECUTE MENSAJES_POR_VER @COD_USUARIO = {pk}")
        var = []
        for x in query:
            var.append({'CANTIDAD':x[0],'COD': x[1]})
        return HttpResponse(json.dumps(var).encode('utf8'),status=status.HTTP_200_OK)

class MensajesSinVerXArea(APIView):
    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query  = cursor.execute(f"EXECUTE MENSAJES_POR_VER_AREA @COD_USUARIO = {pk}")
        var = []
        for x in query:
            var.append({'CANTIDAD':x[0],'COD': x[1]})
        return HttpResponse(json.dumps(var).encode('utf8'),status=status.HTTP_200_OK)

class MensajesSinVerXsolicitudcLIENTE(APIView):
    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query  = cursor.execute(f"EXECUTE MENSAJES_POR_VER_CLIENTE @COD_USUARIO = {pk}")
        var = []
        for x in query:
            var.append({'CANTIDAD':x[0],'COD': x[1]})
        return HttpResponse(json.dumps(var).encode('utf8'),status=status.HTTP_200_OK)

class NOTIFICACIONES_CLIENTE(APIView):
    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query  = cursor.execute(f"EXECUTE NOTIFICACIONES_CLIENTE @COD_USUARIO = {pk}")
        var = ''
        for x in query:
            var = str(x[0])  
        return HttpResponse(json.dumps(var).encode('utf8'),status=status.HTTP_200_OK)

class NOTIFICACION_DESCRIPCION_CLIENTE(APIView):
    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query  = cursor.execute(f"EXECUTE NOTIFICACION_DESCRIPCION @COD_USUARIO = {pk}")
        var = []
        for x in query:
            var.append( {'CANTIDAD':x[0], 'COD': x[1] })
        return HttpResponse(json.dumps(var).encode('utf8'),status=status.HTTP_200_OK)

class VistoSoporte(APIView):
    def put(self, request, pk , tk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE VISTO_SOPORTE @COD_USUARIO = {pk} , @COD_TICKET = {tk}")
        return HttpResponse(json.dumps('Actualizado').encode('utf8'),status=status.HTTP_200_OK)

class EnviarMensaje(APIView):
    def post(self, request, format=None):
        data = request.data[0]
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE ENVIAR_MENSAJE @CODIGO_TICKET = {data['CODIGO_TICKET']} , @CODIGO_USUARIO = {data['CODIGO_USUARIO']}, @FECHA_MENSAJE = '{data['FECHA_MENSAJE']}', @HORA_MENSAJE = '{data['HORA_MENSAJE']}' , @MENSAJE = '{data['MENSAJE']}' , @ADJUNTO = '{data['ADJUNTO']}' ")
        return HttpResponse(json.dumps('Guardado').encode('utf8'),status=status.HTTP_200_OK)


class NotificacionTotalArea(APIView):
    def get(self, request, CA , ET , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE NOTIFICACIONES_AREAS @COD_USUARIO = {CA} , @ESTADO = '{ET}' ")
        var = ''
        for x in cursor:
            var = str(x[0])  
        return HttpResponse(json.dumps(var).encode('utf8'),status=status.HTTP_200_OK)

class NotificacionMensajeTotalArea(APIView):
    def get(self, request, CA , ET , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE NOTIFICACION_MENSAJES_AREAS @COD_USUARIO = {CA} , @ESTADO = '{ET}' ")
        var = ''
        for x in cursor:
            var = str(x[0])  
        return HttpResponse(json.dumps(var).encode('utf8'),status=status.HTTP_200_OK)