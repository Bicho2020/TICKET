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
import pyodbc 


class AdjuntoContrato(APIView):
    def post(self, request, pk , format=None):
        myfile  = request.FILES['file']
        fs = FileSystemStorage(location="MEDIA/") #defaults to   MEDIA_ROOT  
        fs.save(str(pk), myfile)
        return HttpResponse('Guardado',status=status.HTTP_200_OK)

class ContratoCRUD(APIView):

    def get(self, request,  format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        data = cursor.execute("EXECUTE LISTAR_CONTRATOS")
        arr = []
        for x in data:
            arr.append({  'COD_CONTRATO': x[0],
                'NOMBRE_CLIENTE': x[1],
                'COD_CLIENTE': x[2],
                'PERSONA_CONTACTO': x[3],
                'COD_PERSONA_CONT': x[4],
                'FECHA_DOCUMENTO'  : str(x[5]),
                'NOMBRE_CONTRATO': x[6],
                'NUMERO_CONTRATO': x[7],
                'FECHA_INICIO_CONTRATO': str(x[8]),
                'FECHA_TERMINO_CONTRATO': str(x[9]),
                'DESCRIPCION': x[10],
                'TIPO_PERIODO':x[11],
                'ESTADO':x[12],
                'HORAS': x[13],
                'TIPO_CONTRATO': x[14],
                'HORAS_RESTANTES': x[15],
                'ADJUNTO':x[16]
            })  
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)

    def post(self, request,  format=None):
        data = request.data
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query =  (f"EXECUTE GUARDAR_CONTRATO @NOMBRE_CLIENTE = '{data['NOMBRE_CLIENTE']}' ,@COD_CLIENTE = '{data['COD_CLIENTE']}' ,@PERSONA_CONTACTO = '{data['PERSONA_CONTACTO']}',@COD_PERSONA_CONTACTO = '{data['COD_PERSONA_CONTACTO']}' , @FECHA_DOCUMENTO = '{data['FECHA_DOCUMENTO']}',@NOMBRE_CONTRATO = '{data['NOMBRE_CONTRATO']}',@NUMERO_CONTRATO = '{data['NUMERO_CONTRATO']}' , @FECHA_INICIO_CONTRATO = '{data['FECHA_INICIO_CONTRATO']}',@FECHA_TERMINO_CONTRATO = '{data['FECHA_TERMINO_CONTRATO']}', @DESCRIPCION = '{data['DESCRIPCION']}' , @TIPO_PERIODO = {data['TIPO_PERIODO']} , @ESTADO = '{data['ESTADO']}' , @HORAS = {data['HORAS']} , @TIPO_CONTRATO = '{data['TIPO_CONTRATO']}' , @ADJUNTO = '{data['ADJUNTO']}' ")
        cursor.execute(query) 
        return HttpResponse(json.dumps('Guardado').encode('utf8'),status=status.HTTP_200_OK)

    def put(self, request, format=None):
        data = request.data
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query =  (f"EXECUTE ACTUALIZAR_CONTRATO @COD_CONTRATO = {data['COD_CONTRATO']} ,  @NOMBRE_CLIENTE = '{data['NOMBRE_CLIENTE']}' , @COD_CLIENTE = '{data['COD_CLIENTE']}'  , @PERSONA_CONTACTO  = '{data['PERSONA_CONTACTO']}' , @COD_PERSONA_CONTACTO = '{data['COD_PERSONA_CONTACTO']}' , @NOMBRE_CONTRATO = '{data['NOMBRE_CONTRATO']}' , @NUMERO_CONTRATO = '{data['NUMERO_CONTRATO']}'  , @FECHA_INICIO_CONTRATO = '{data['FECHA_INICIO_CONTRATO']}' , @FECHA_TERMINO_CONTRATO = '{data['FECHA_TERMINO_CONTRATO']}' , @DESCRIPCION = '{data['DESCRIPCION']}' ,  @HORAS = {data['HORAS']}, @ESTADO = '{data['ESTADO']}', @TIPO_CONTRATO =  '{data['TIPO_CONTRATO']}' , @TIPO_PERIODO = {data['TIPO_PERIODO']} ")
        cursor.execute(query) 
        return HttpResponse(json.dumps('Guardado').encode('utf8'),status=status.HTTP_200_OK)

class contratoEliminar(APIView):
    def delete(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE ELIMINAR_CONTRATO @COD_CONTRATO = {pk}")
        return HttpResponse(json.dumps('Eliminado').encode('utf8'),status=status.HTTP_200_OK)

class ContratosNUMEROSAP(APIView):
    def get(self, request ,format=None):
        conn = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};Server=10.0.2.2;Database=Kyros_Test;uid=sa;pwd=SAPB1Admin')
        cursor = conn.cursor()
        cursor.execute(f"SELECT ContractID FROM OCTR")
        arr = []
        for x in cursor:
            arr.append({'CONTRACTID':x[0]})
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)


class ContratoSAP(APIView):
    def get(self, request, pk , format=None):
        conn = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};Server=10.0.2.2;Database=Kyros_Test;uid=sa;pwd=SAPB1Admin')
        cursor = conn.cursor()
        cursor.execute(f"SELECT A.CstmrName as 'NOMBRE_CLIENTE' , a.cstmrcode as 'COD_CLIENTE' , O.Name as 'NOMBRE_CONTACTO' , O.cntctCode as 'PERSONA_CONTACTO', A.Descriptio as 'NOMBRE_CONTRATO' , CONVERT(NVARCHAR,A.StartDate,23) as 'FECHA_INICIO_CONTRATO' , CONVERT(NVARCHAR,A.EndDate,23) as 'FECHA_TERMINO_CONTRATO' , A.Status as 'ESTADO' , A.U_TipoC as 'TIPO' , A.U_TIPO AS 'TIPO PERIODO' , A.U_HCONTRATADAS  as 'HORAS' FROM OCTR AS A LEFT JOIN OCPR AS O ON O.CntctCode = A.CntctCode WHERE A.ContractID = {pk}")
        arr = []
        for x in cursor:
            arr.append({'NOMBRE_CLIENTE':x[0],'COD_CLIENTE':x[1] ,'NOMBRE_CONTACTO':x[2] , 'PERSONA_CONTACTO':x[3] ,
             'NOMBRE_CONTRATO':x[4] , 'FECHA_INICIO_CONTRATO':x[5] ,
            'FECHA_TERMINO_CONTRATO':x[6] , 'ESTADO':x[7] , 'TIPO':x[8] , 'TIPO_PERIODO':x[9] , 'HORAS':x[10]  })
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)

class TicketMisContratos(APIView):
    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE LISTAR_CONTRATO @COD_CLIENTE = '{pk}'")
        arr = []
        for x in cursor:
            arr.append({
            'NUMERO_CONTRATO':x[0] , 'TIPO_CONTRATO':x[1]  , 'FECHA_INICIO_CONTRATO':str(x[2])  , 
            'FECHA_TERMINO_CONTRATO':str(x[3])  , 'NUMERO_CONTRATO':x[4]  , 'TIPO_PERIODO':x[5]  ,
            'HORAS':x[6]  , 'HORAS_RESTANTES' :x[7] , 'ADJUNTO':x[8]})
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)

class HorasRestantes(APIView):
    def get(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE LISTAR_HORAS @NUMERO_CONTRATO = '{pk}'")
        arr = []
        for x in cursor:
            arr.append({'HORAS':x[0],'RESTANTES':x[1]})
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)

class DescontarHorasContratos(APIView):
    def put(self, request, pk , hr , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE DESCONTAR_HORAS @COD_CONTRATO = '{pk}' , @HORAS = {hr} ")
        return HttpResponse(json.dumps('LISTO').encode('utf8'), status=status.HTTP_200_OK)