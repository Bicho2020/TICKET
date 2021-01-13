from django.db import connection
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core import serializers
from django.http import HttpResponse
import json
import pyodbc 

class Usuario(APIView):

    def get(self, request, format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query  = cursor.execute("EXECUTE USUARIOS")
        arr = []
        for x in query:
            arr.append({'COD_USUARIO':x[0],
                'NOMBRE_CLIENTE':x[1],
                'CORREO':x[2],
                'COD_CONTACTO':x[3],
                'telefono':x[4],
                'ESACTIVO':x[5],
                'COD_ROL':x[6],
                'CONTRASEÑA':x[7],
                'NOMBRE_CONTACTO':x[8],
                'COD_CLIENTE':x[9],
                'COD_CONTACTO':x[10]
            })
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)
    
    def put(self, request, format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        data = request.data[0]
        cursor.execute("EXECUTE ACTUALIZAR_USUARIO @NOMBRE_CLIENTE = '"+data['NOMBRE_CLIENTE']+"' , @CORREO  = '"+data['CORREO']+"' , @COD_CONTACTO = "+str(data['COD_CONTACTO'])+" , @TELEFONO = "+str(data['TELEFONO'])+" , @ESACTIVO = "+str(data['ESACTIVO'])+" , @CONTRASEÑA = '"+data['CONTRASEÑA']+"' , @COD_ROL = "+str(data['COD_ROL'])+" , @COD_USUARIO = "+str(data['COD_USUARIO'])+" , @COD_CLIENTE = '"+data['COD_CLIENTE']+"' , @NOMBRE_CONTACTO = '"+data['NOMBRE_CONTACTO']+"'")
        return HttpResponse('application/json; charset=utf-8', status=status.HTTP_200_OK)
    
    def post(self, request, format=None):
        data = request.data[0]
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute("EXECUTE AGREGAR_USUARIO @NOMBRE_CLIENTE = '"+data['NOMBRE_CLIENTE']+"' , @CORREO  = '"+data['CORREO']+"' , @TELEFONO = "+str(data['TELEFONO'])+" , @CONTRASEÑA = '"+data['CONTRASEÑA']+"' , @COD_ROL = "+str(data['COD_ROL'])+" , @COD_CONTACTO = '"+str(data['COD_CONTACTO'])+"' , @NOMBRE_CONTACTO = '"+data['NOMBRE_CONTACTO']+"' , @COD_CLIENTE = '"+data['COD_CLIENTE']+"' ")

        return HttpResponse('Guardado',status=status.HTTP_200_OK)


class Modificar(APIView):
    def put(self, request, pk , estado ,  format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute("UPDATE USUARIO SET ESACTIVO = "+estado+" WHERE COD_USUARIO = "+pk+"  ")
        return HttpResponse('Actualizado',status=status.HTTP_200_OK)

class Login(APIView):
    def post(self, request, CORREO , PASSWD ,  format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query = cursor.execute("EXECUTE LOGIN @CORREO = '"+CORREO+"'  , @CONTRASEÑA = '"+PASSWD+"'")
        arr = []
        for x in query:
            arr.append({'COD_USUARIO':x[0],'COD_ROL':x[1],'COD_CLIENTE':x[2]})
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)

class VerificarLoginContrato(APIView):
    def post(self, request, pk,  format=None):
        print(pk)
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query = cursor.execute(f"EXECUTE VERIFICAR_CONTRATO @COD_CLIENTE = '{pk}' ")
        arr = []
        for x in query:
            arr.append({'RS':x[0]})
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)

class FiltrarUsuario(APIView):
    def get(self, request, pk  , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query = cursor.execute("EXECUTE FILTRAR_USUARIO @COD_USUARIO = "+pk+"")
        arr = []
        for x in query:
            arr.append(
                {'COD_USUARIO':x[0],
                'NOMBRE_CLIENTE':x[1],
                'CORREO':x[2],
                'COD_CONTACTO':x[3],
                'telefono':x[4],
                'ESACTIVO':x[5],
                'COD_ROL':x[6],
                'CONTRASEÑA':x[7]
            })
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)


class ClienteSAP(APIView):
    def get(self,request,format=None):
        conn = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};Server=10.0.2.2;Database=Kyros_Test;uid=sa;pwd=SAPB1Admin')
        cursor = conn.cursor()
        cursor.execute("select CARDCODE, CARDNAME  from OCRD WHERE CardType = 'C'")
        arr = []
        for x in cursor:
            arr.append({'CARDCODE':x[0],'CARDNAME':x[1]})
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)

class ClienteContactoSAP(APIView):
    def get(self,request, pk , format=None):
        conn = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};Server=10.0.2.2;Database=Kyros_Test;uid=sa;pwd=SAPB1Admin')
        cursor = conn.cursor()
        cursor.execute(f"select CntctCode , CardCode ,Name from OCPR where CardCode = '{pk}'")
        arr = []
        for x in cursor:
            arr.append({'COD':x[0],'CARDCODE':x[1] ,'NOMBRE':x[2]})
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)

class LISTAR_USUARIO_ASIGNACION(APIView):
    def get(self,request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE LISTAR_USUARIO_ASIGNACION @COD_ROL = '{pk}' ")
        arr = []
        for x in cursor:
            arr.append({'COD_CLIENTE':x[0],'NOMBRE_CLIENTE':x[1]})
        return HttpResponse(json.dumps(arr).encode('utf8'), status=status.HTTP_200_OK)

class ASIGNAR_ESCALADO(APIView):
    def put(self,request, pk , ct , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE ASIGNAR_ESCALADO @COD_USUARIO = {pk} , @COD_TICKET = {ct} ")
        return HttpResponse(json.dumps('Asignado').encode('utf8'), status=status.HTTP_200_OK)

class TraerTelefono(APIView):
    def get(self,request, CT, format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE TELEFONO_USUARIO @COD_TICKET = {CT}")
        TELEFONO = ''
        for x in cursor:
            TELEFONO = x[0]
        return HttpResponse(json.dumps(TELEFONO).encode('utf8'), status=status.HTTP_200_OK)
        
        


        