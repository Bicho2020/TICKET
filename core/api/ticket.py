from django.db import connection
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core import serializers
from django.http import HttpResponse
from django.conf import settings
from django.core.files.storage import FileSystemStorage
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email import encoders
import json
import pyodbc 
import mimetypes
import requests
from datetime import date
from datetime import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
w, h = A4

class Imagen(APIView):
    def post(self, request, pk , format=None):
        myfile  = request.FILES['file']
        fs = FileSystemStorage(location="MEDIA/") #defaults to   MEDIA_ROOT  
        fs.save(str(pk), myfile)
        return HttpResponse('Guardado',status=status.HTTP_200_OK)

class GuadarTicket(APIView):
    def post(self, request , format=None):
        data = request.data[0]
        queryGetUsuario = "SELECT TOP 1  COD_USUARIO FROM USUARIO WHERE COD_ROL = 1 AND COD_USUARIO <> 23  ORDER BY NEWID()"
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        user = cursor.execute(queryGetUsuario)
        getuser = ''
        for x in user:
            getuser = x[0]
        querySelectCodigo =  "SELECT CODIGO_SAP FROM ESTADO WHERE COD_OPERACION = 5 AND ES_ESCALADO = 0"
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        ES = cursor.execute(querySelectCodigo)
        EST = ''
        for x in ES:
            EST = x[0]
        query = (f"EXECUTE GUARDAR_TICKET @COD_USUARIO_SOLICITANTE = {data['COD_USUARIO_SOLICITANTE']} , @COD_USUARIO_SOPORTE ={getuser} , @FECHA_SOLICITUD = '{str(data['FECHA_SOLICITUD'])}', @HORA_SOLICITUD = '{data['HORA_SOLICITUD']}', @NIVEL_URGENCIA = '{data['NIVEL_URGENCIA']}', @TIPO_PROBLEMA = '{data['TIPO_PROBLEMA']}', @COMENTARIO = '{data['COMENTARIO']}', @URL_ADJUNTO = '{data['URL_ADJUNTO']}', @DESCRIPCION = '{data['DESCRIPCION']}' , @ID_CONTRATO = '{data['ID_CONTRATO']}' , @TIPO_CONTRATO = '{data['TIPO_CONTRATO']}' , @ESTADO = '{EST}'   ")
        print(query)
        cursor.execute(query)
        
        getCorreo = cursor.execute(f"SELECT CORREO FROM USUARIO WHERE COD_USUARIO = {getuser}")
        CorreoSoporte = ''
        for x in getCorreo:
            CorreoSoporte = x[0]
        getLastCod = cursor.execute("SELECT TOP 1 COD_TICKET FROM TICKET ORDER BY COD_TICKET DESC")
        Last = ''
        for x in getLastCod:
            Last = x[0]
     
        remitente = 'soporte@kyros.cl'
        destinatarios = [str(data['CORREO']),str(CorreoSoporte)]
        asunto = 'Soporte Kyros'
        cuerpo = (f"<span class='col'>Estimado {data['CLIENTE']}:</span><br><br>"
                 f"<span class='col' >Gracias por contactarnos a Soporte Kyros.</span><br><br>"
                 f"<span class='col'>Hemos generado nuevo ticket de servicio para su incidencia con los siguientes antecedentes:</span><br><br>"
                 f"<span style='margin-left:30px;' class='col'> -          N° de Ticket: {Last}</span><br><br>"
                 f"<span style='margin-left:30px;' class='col'> -          Asunto: {data['DESCRIPCION']}</span><br><br>"
                 f"<span style='margin-left:30px;' class='col'> -          Concepto: {data['TIPO_PROBLEMA']}</span><br><br>"
                 f"<span style='margin-left:30px;' class='col'> -          Fecha Incidencia : {data['FECHA_SOLICITUD']} – {data['HORA_SOLICITUD']}</span><br><br>"
                 f"<img src='https://i.ibb.co/R2QJwTM/soporte.jpg' alt=''>")
        
        mensaje = MIMEMultipart()
        mensaje['From'] = remitente
        mensaje['To'] = ", ".join(destinatarios)
        mensaje['Subject'] = asunto
        mensaje.attach(MIMEText(cuerpo, 'html'))
        sesion_smtp = smtplib.SMTP('smtp.gmail.com', 587)
        sesion_smtp.starttls()
        sesion_smtp.login('soporte@kyros.cl','soporte2016_')
        texto = mensaje.as_string()
        sesion_smtp.sendmail(remitente, destinatarios, texto )
        sesion_smtp.quit()
        url = "http://10.0.2.2:59987/api/TicketSap"
        headers = {'Content-type':'application/json', 'Accept':'application/json'}
        data = {'CustmrName': str(data['CLIENTE']),'CustomerCode':str(data['COD_CLIENTE']),'ContactCode': int(data['COD_PERSONA_CONTRATO']),'origin':-1, 'problemType': int(data['COD_TIPO_PROBLEMA']), 'calltype': 1,  'U_HCONSUMIDAS': int(data['HORAS_CONSUMIDAS']),'Subject': str(data['COMENTARIO']), 'itemCode': str('SAPSOP01'),  'Status': int(EST)}
        x = requests.post(url,  json=data, headers=headers)
        Sapcode = x.text
        output = Sapcode.replace('"',' ')
        query = (f"UPDATE TICKET set COD_SAP = {int(output)} WHERE COD_TICKET = {int(Last)}")
        cursor.execute(query)
        return HttpResponse('Guardado',status=status.HTTP_200_OK)
        
    def get(self, request, format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query = cursor.execute(f"SELECT COD_TICKET , ESTADO FROM TICKET")
        arr = []
        for x in query:
            arr.append(
                {'COD':x[0],'ESTADO':x[1]})  
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)

class Solicitudes(APIView):

    def get(self, request, pk , tipo , f ,  o , format=None):
        query = ''
        if(int(tipo) == 1):
            query = (f"EXECUTE MIS_TICKET @COD_USUARIO = {pk} , @FILTRO = '{f}' , @ORDER = '{o}' ")
        if(int(tipo) == 2):
            query = (f"EXECUTE MIS_TICKET_SOPORTE @COD_USUARIO = {pk} , @FILTRO = '{f}' , @ORDER = '{o}' ")
        if(int(tipo) == 3):
            query = (f"EXECUTE MIS_TICKET_SOPORTE_AREA  @COD_USUARIO = {pk} , @FILTRO = '{f}' , @ORDER = '{o}' ")
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query  = cursor.execute(query)
        arr = []
        for x in query:
            arr.append(
                {'COD_TICKET':x[0],
                'SOPORTE':x[1],
                'CORREO_SOPORTE':x[2],
                'FECHA_SOLICITUD':x[3],
                'HORA_SOLICITUD':str(x[4]),
                'NIVEL_URGENCIA':x[5],
                'TIPO_PROBLEMA':x[6],
                'COMENTARIO':x[7],
                'URL_ADJUNTO':x[8],
                'ESTADO':x[9],
                'DESCRIPCION':x[10],
                'ID_CONTRATO':x[11],
                'TIPO_CONTRATO':x[12],
                'RESOLUCION':x[13],
                'ADJUNTO':x[14]
            }) 
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)
    
    def put(self, request, pk , tipo , f , o ,  format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE CAMBIAR_ESTADO @COD_TICKET  = {pk} , @ESTADO = '{tipo}' ")
        cursor_2 = django_cursor.connection.cursor()
        cursor_2.execute(f"SELECT COD_SAP FROM TICKET WHERE COD_TICKET = {pk} ")
        COD_SAP = ''
        for x in cursor_2:
            COD_SAP = x[0]
        print(COD_SAP)
        url = (f"http://10.0.2.2:59987/api/TicketSap/estado/{COD_SAP}/{tipo}")
        x = requests.put(url)
        print(x.text)
        return HttpResponse('Actualizado', status=status.HTTP_200_OK)
    
    

class HoraTicketSap(APIView):
    def put(self,request, ct , hh):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"SELECT COD_SAP FROM TICKET WHERE COD_TICKET = {ct}")
        COD_SAP = ''
        for x in cursor:
            COD_SAP = x[0]
        url = (f"http://10.0.2.2:59987/api/TicketSap/horas/{COD_SAP}/{hh}")
        x = requests.put(url)
        return HttpResponse('Actualizado', status=status.HTTP_200_OK)
    
class ActualizarVistoCliente(APIView):
    def put(self, request, pk , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute("EXECUTE VISTO_CLIENTE_TODOS @COD_USUARIO  = "+pk+"")
        return HttpResponse('Actualizado', status=status.HTTP_200_OK)

class VistoCliente(APIView):
    def put(self, request, pk , tk ,  format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute("EXECUTE VISTO_CLIENTE @COD_USUARIO  = "+pk+" , @COD_TICKET = "+tk+" ")
        return HttpResponse('Actualizado', status=status.HTTP_200_OK)

class ListarSoporte(APIView):
    def get(self, request, format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query = cursor.execute("EXECUTE LISTAR_SOPORTES")
        arr = []
        for x in query:
            arr.append(
                {'COD_USUARIO':x[0],'USUARIO':x[1]})  
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)

class AsignarSoporte(APIView):
    def put(self, request, CS , CT  ,  format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE ASIGNAR_SOPORTE @COD_SOPORTE = {CS} , @COD_TICKET = {CT}")
        getCorreo = cursor.execute(f"SELECT CORREO FROM USUARIO WHERE COD_USUARIO = {CS}")
        CorreoSoporte = ''
        for x in getCorreo:
            CorreoSoporte = x[0]
        remitente = 'soporte@kyros.cl'
        destinatarios = [str(CorreoSoporte)]
        asunto = 'Soporte Kyros'
        cuerpo = (f"<span class='col'>Estimado usuario se le ha asignado el ticket Número {CT} </span><br><br>"
                  f"<span class='col'>Saludos de Soporte Kyros.</span><br><br>"
                 f"<img src='https://i.ibb.co/R2QJwTM/soporte.jpg' alt=''>")
 
        mensaje = MIMEMultipart()
        mensaje['From'] = remitente
        mensaje['To'] = ", ".join(destinatarios)
        mensaje['Subject'] = asunto
        mensaje.attach(MIMEText(cuerpo, 'html'))
        sesion_smtp = smtplib.SMTP('smtp.gmail.com', 587)
        sesion_smtp.starttls()
        sesion_smtp.login('soporte@kyros.cl','soporte2016_')
        texto = mensaje.as_string()
        sesion_smtp.sendmail(remitente, destinatarios, texto )
        sesion_smtp.quit()
        return HttpResponse('Asignado', status=status.HTTP_200_OK)


class Resolucion(APIView):
    def post(self, request, CT , RS , H , FC , HC , AD ,  format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE RESOLUCION @COD_TICKET  = {CT} , @RESOLUCION = '{RS}' , @HORAS = {H} , @FECHA = '{FC}' , @HORA_CREACION = '{HC}' , @ADJUNTO = '{AD}' ")
        return HttpResponse(status=status.HTTP_200_OK)

class ListarResolucion(APIView):
    def get(self, request, pk ,   format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query = cursor.execute(f"execute LISTAR_SOLUCIONES @cod_ticket = {pk} ")
        arr = []
        for x in query:
            arr.append(
                {'RS':x[0],'H':x[1],'FECHA':str(x[2]),'HORAS':str(x[3]) , 'ADJUNTO':str(x[4]) })  
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)

class ResolucionSoporte(APIView):
    def post(self, request, CT , RS , H , TP , FC , HC, AD ,  format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"EXECUTE RESOLUCION_AREA @COD_TICKET  = {CT} , @RESOLUCION = '{RS}' , @HORAS = {H} , @AREA = '{TP}' , @FECHA = '{FC}' , @HORA_CREACION = '{HC}' , @ADJUNTO = '{AD}'  ")
        return HttpResponse(status=status.HTTP_200_OK)

class ListarResolucionSoporte(APIView):
    def get(self, request, pk ,   format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        query = cursor.execute(f"execute LISTAR_SOLUCIONES_AREA @cod_ticket = {pk} ")
        arr = []
        for x in query:
            arr.append({'RS':x[0],'H':x[1],'AREA':x[2],'FECHA':str(x[3]),'HORAS':str(x[4]) , 'ADJUNTO':str(x[5]) })  
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)

class EnviarResolucionSap(APIView):
    def post(self,request, ct , rs , format=None):
        django_cursor = connection.cursor()
        cursor_2 = django_cursor.connection.cursor()
        cursor_2.execute(f"SELECT COD_SAP FROM TICKET WHERE COD_TICKET = {ct} ")
        COD_SAP = ''
        for x in cursor_2:
            COD_SAP = x[0]
        print(COD_SAP)
        url = (f"http://10.0.2.2:59987/api/TicketSap/resolucion/{COD_SAP}/{rs}")
        x = requests.put(url)
        print(x.text)
        return HttpResponse(json.dumps("Exitoso").encode('utf8'),status=status.HTTP_200_OK)

class Sugrencia(APIView):
    def get(self, request,  asun , desc ,  format=None):
        conn = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};Server=10.0.2.2;Database=Kyros_Test;uid=sa;pwd=SAPB1Admin')
        cursor = conn.cursor()
        cursor.execute(f"SELECT COUNT(*) FROM OSLT where Symptom like '%{asun}%' or Descriptio like '%{desc}%'")
        arr = []
        for x in cursor:
            arr.append({'RS':x[0]})  
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)

class SugrenciaLista(APIView):
    def get(self, request,  asun , desc ,  format=None):
        conn = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};Server=10.0.2.2;Database=Kyros_Test;uid=sa;pwd=SAPB1Admin')
        cursor = conn.cursor()
        cursor.execute(f"SELECT SUBJECT , Symptom ,  descriptio FROM OSLT where Symptom like '%{asun}' or Descriptio like '%{desc}'")
        arr = []
        for x in cursor:
            arr.append({'RES':x[0],'SYMPTOM':x[1],'DESCRIPTIO':x[2]})  
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)

class ListarTipoProblema(APIView):
    def get(self, request,   format=None):
        conn = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};Server=10.0.2.2;Database=Kyros_Test;uid=sa;pwd=SAPB1Admin')
        cursor = conn.cursor()
        cursor.execute(f"SELECT PRBLMTYPID , NAME  FROM OSCP ORDER BY PRBLMTYPID ASC")
        arr = []
        for x in cursor:
            arr.append({'ID':x[0],'DESC':x[1]})  
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)

class CodPersonaContacto(APIView):
    def get(self, request, CPC ,  format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        cursor.execute(f"SELECT COD_PERSONA_CONTACTO FROM CONTRATO WHERE NUMERO_CONTRATO =  {CPC}")
        arr = []
        for x in cursor:
            arr.append({'COD_PERSONA_CONTRATO':x[0]})  
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)

class EnviarCorreo(APIView):
    def post(self, request , CS , CT , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        getCorreo = cursor.execute(f"SELECT CORREO FROM USUARIO WHERE COD_USUARIO = {CS}")
        CorreoSoporte = ''
        for x in getCorreo:
            CorreoSoporte = x[0]
        remitente = 'soporte@kyros.cl'
        destinatarios = [str(CorreoSoporte)]
        asunto = 'Soporte Kyros'
        cuerpo = (f"<span class='col'>Estimado usuario se le ha asignado el ticket Número {CT} </span><br><br>"
                  f"<span class='col'>Saludos de Soporte Kyros.</span><br><br>"
                 f"<img src='https://i.ibb.co/R2QJwTM/soporte.jpg' alt=''>")        
        mensaje = MIMEMultipart()
        mensaje['From'] = remitente
        mensaje['To'] = ", ".join(destinatarios)
        mensaje['Subject'] = asunto
        mensaje.attach(MIMEText(cuerpo, 'html'))
        sesion_smtp = smtplib.SMTP('smtp.gmail.com', 587)
        sesion_smtp.starttls()
        sesion_smtp.login('soporte@kyros.cl','soporte2016_')
        texto = mensaje.as_string()
        sesion_smtp.sendmail(remitente, destinatarios, texto )
        sesion_smtp.quit()
        return HttpResponse('Correo Enviado',status=status.HTTP_200_OK)


    
class EnviarCorreoSoporte(APIView):
    def post(self, request , CT , EST , format=None):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        getCorreo = cursor.execute(f"SELECT US.CORREO FROM TICKET AS TK  INNER JOIN USUARIO AS US ON TK.COD_USUARIO_SOLICITANTE = US.COD_USUARIO WHERE TK.COD_TICKET ={CT}")
        CorreoSoporte = ''
        for x in getCorreo:
            CorreoSoporte = x[0]
        remitente = 'soporte@kyros.cl'
        destinatarios = [str(CorreoSoporte)]
        asunto = 'Soporte Kyros'
        cuerpo = (f"<span class='col'>Estimado usuario , su ticket número {CT} tiene un nuevo estado ({EST}).</span><br><br>"
                  f"<span class='col'>Saludos de Soporte Kyros.</span><br><br>"
                 f"<img src='https://i.ibb.co/R2QJwTM/soporte.jpg' alt=''>")        
        mensaje = MIMEMultipart()
        mensaje['From'] = remitente
        mensaje['To'] = ", ".join(destinatarios)
        mensaje['Subject'] = asunto
        mensaje.attach(MIMEText(cuerpo, 'html'))
        sesion_smtp = smtplib.SMTP('smtp.gmail.com', 587)
        sesion_smtp.starttls()
        sesion_smtp.login('soporte@kyros.cl','soporte2016_')
        texto = mensaje.as_string()
        sesion_smtp.sendmail(remitente, destinatarios, texto )
        sesion_smtp.quit()
        return HttpResponse('Correo Enviado',status=status.HTTP_200_OK)

class Soluciones(APIView):
    def get(self, request, format=None):
        query = (f"SELECT Subject , Symptom , Cause , Descriptio , U_SAP , StatusNum FROM OSLT")
        conn = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};Server=10.0.2.2;Database=Kyros_Test;uid=sa;pwd=SAPB1Admin')
        cursor = conn.cursor()
        cursor.execute(query)
        arr = []
        for x in cursor:
            arr.append({'ASUNTO':x[0],'SOLUCION':x[1],'PROBLEMA':x[2],'COMENTARIO':x[3],'CATEGORIA':x[4],'STATUS':x[5]}) 
        return HttpResponse(json.dumps(arr).encode('utf8'),status=status.HTTP_200_OK)

class PDF(APIView):
    def post(self , request , ct , hh , format=None):
        CONSULTOR = ConsultorAcargo(ct)
        CODIGO_SAP = COD_TICKET_SAP(ct)
        query = (f"EXECUTE DATOS_TICKET @COD_TICKET = {CODIGO_SAP}")
        conn = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};Server=10.0.2.2;Database=Kyros_Test;uid=sa;pwd=SAPB1Admin')
        cursor = conn.cursor()
        cursor.execute(query)
        arr = []
        for x in cursor:
            arr.append(
                {'CLIENTE':x[1],
                'CONTACTO':x[2],
                'TELEFONO':x[3],
                'CORREO':x[4],
                'CREACION':x[5],
                'CIERRE':x[6],
                'TIPO_LLAMADA':x[7],
                'ASUNTO':x[8],
                'RESOLUCION':x[9],
                'HORAS_UTILIZADAS':x[10],
                'HORAS_CONSUMIDAS':x[11],
                'HORAS_RESTANTES':x[12],
                'HORAS_CONTRATADAS':x[13]}
            ) 
        CLIENTE = arr[0]['CLIENTE']
        CONTACTO = arr[0]['CONTACTO']
        TELEFONO = arr[0]['TELEFONO']
        CORREO  = arr[0]['CORREO']
        CIERRE = arr[0]['CIERRE']
        TIPO_LLAMADA = arr[0]['TIPO_LLAMADA']
        ASUNTO = arr[0]['ASUNTO']
        RESOLUCION = arr[0]['RESOLUCION']
        HORAS_UTILIZADAS = arr[0]['HORAS_UTILIZADAS']
        HORAS_CONSUMIDAS = arr[0]['HORAS_CONSUMIDAS']
        HORAS_RESTANTES = arr[0]['HORAS_RESTANTES']
        HORAS_CONTRATADAS = arr[0]['HORAS_CONTRATADAS']
        CREACION = arr[0]['CREACION']
        CREAR_PDF_TICKET(ct,hh,CONSULTOR,CODIGO_SAP,CLIENTE,CONTACTO,TELEFONO,CORREO,CIERRE,TIPO_LLAMADA,ASUNTO,RESOLUCION,HORAS_UTILIZADAS,HORAS_CONSUMIDAS,HORAS_RESTANTES,HORAS_CONTRATADAS,CREACION)
        return HttpResponse(json.dumps(CLIENTE).encode('utf8'),status=status.HTTP_200_OK)



def ConsultorAcargo(CT):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    cursor.execute(f"SELECT US.NOMBRE_CLIENTE FROM TICKET AS TK JOIN USUARIO AS US ON TK.COD_USUARIO_SOPORTE = US.COD_USUARIO WHERE TK.COD_TICKET = {CT}")
    Consultor = ''
    for x in cursor:
        Consultor = x[0]
    return Consultor

def COD_TICKET_SAP(CT):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    cursor.execute(f"SELECT TK.COD_SAP FROM TICKET AS TK WHERE TK.COD_TICKET = {CT}")
    SAP = ''
    for x in cursor:
        SAP = x[0]
    return SAP

def CREAR_PDF_TICKET(ct,hh,CONSULTOR,CODIGO_SAP,CLIENTE,CONTACTO,TELEFONO,CORREO,CIERRE,TIPO_LLAMADA,ASUNTO,RESOLUCION,HORAS_UTILIZADAS,HORAS_CONSUMIDAS,HORAS_RESTANTES,HORAS_CONTRATADAS,CREACION):
    c = canvas.Canvas(f"./media/{hh}.pdf")
    logo = ImageReader('http://localhost:8000/media/X.PNG')
    linea = ImageReader('http://localhost:8000/media/linea.PNG')
    c.drawImage(logo, 555, h - 30 , width=-500, height=-80)
    c.drawImage(linea, 550, h - 285 , width=-500, height=-0.5)
    c.drawImage(linea, 550, h - 390 , width=-500, height=-0.5)
    c.drawImage(linea, 550, h - 490 , width=-500, height=-1)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(245, h - 140, "Ticket de Soporte")
    c.setFont('Times-Roman',10)
    c.drawString(110, h - 180, f"Cliente: {CLIENTE}")
    c.drawString(110, h - 200, f"Contacto: {CONTACTO}")
    c.drawString(110, h - 220, f"E-mail: {CORREO}")
    c.drawString(110, h - 240, f"Teléfono: {TELEFONO}")
    c.drawString(110, h - 260, f"Consultor: {CONSULTOR}")
    c.drawString(355, h - 180, f"N° de Ticket: {ct}")
    c.drawString(355, h - 200, f"Creación: {CREACION}")
    c.drawString(355, h - 220, f"Cierre: {CIERRE}")
    c.drawString(355, h - 240, f"Tipo Llamada: {TIPO_LLAMADA}")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(110, h - 320, f"Asunto Reportado: {ASUNTO}")
    c.drawString(110, h - 365, f"Resolución: {RESOLUCION}")
    c.drawString(110, h - 425, f"Horas Utilizadas Ticket: {HORAS_UTILIZADAS}")
    c.drawString(110, h - 445, f"Horas Consumidas Mes Actual: {HORAS_CONSUMIDAS}")
    c.drawString(110, h - 465, f"Horas Restantes Mes Actual: {HORAS_RESTANTES}")
    c.setFont("Times-Roman", 10)
    c.drawString(60, h - 525 , "** Estimado cliente, de no recibir retroalimentación a la incidencia en un plazo de 72 horas, daremos por cerrado el caso.")
    c.drawString(173,h- 541 , "Si lo  desea podrá reabrirlo bajo un nuevo número de incidencia **")
    c.save()
    GuardarADJUNTOBD(hh,ct)

def GuardarADJUNTOBD(hh,ct):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    cursor.execute(f"UPDATE TICKET SET ADJUNTO = 'http://localhost:8000/media/{hh}.pdf' WHERE COD_TICKET = {ct}")
    EnviarPDFporCorreo(ct,hh)

def EnviarPDFporCorreo(ct,hh):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    cursor.execute(f"SELECT US.CORREO FROM TICKET AS TK JOIN USUARIO AS US ON US.COD_USUARIO = TK.COD_USUARIO_SOLICITANTE WHERE COD_TICKET = {ct}")
    CorreoSoporte = ''
    for x in cursor:
        CorreoSoporte = x[0]
    remitente = 'soporte@kyros.cl'
    destinatarios = [str(CorreoSoporte)]
    asunto = 'Soporte Kyros'
    cuerpo = (f"<span class='col'>Estimado usuario , se adjunta información de su ticket número {ct}.</span><br><br>"
                f"<span class='col'>Saludos de Soporte Kyros.</span><br><br>")
    ruta_adjunto = (f'./media/{hh}.pdf')
    nombre_adjunto = f'{hh}.pdf'   
    mensaje = MIMEMultipart()
    mensaje['From'] = remitente
    mensaje['To'] = ", ".join(destinatarios)
    mensaje['Subject'] = asunto
    mensaje.attach(MIMEText(cuerpo, 'html'))
    archivo_adjunto = open(ruta_adjunto, 'rb')
    adjunto_MIME = MIMEBase('application', 'octet-stream')
    adjunto_MIME.set_payload((archivo_adjunto).read())
    encoders.encode_base64(adjunto_MIME)
    adjunto_MIME.add_header('Content-Disposition', "attachment; filename= %s" % nombre_adjunto)
    mensaje.attach(adjunto_MIME)
    sesion_smtp = smtplib.SMTP('smtp.gmail.com', 587)
    sesion_smtp.starttls()
    sesion_smtp.login('soporte@kyros.cl','soporte2016_')
    texto = mensaje.as_string()
    sesion_smtp.sendmail(remitente, destinatarios, texto )
    sesion_smtp.quit()


class EnviarErrorCreacionTicket(APIView):
    def post(self, request, COD , format=None):
        queryGetUsuario = f"SELECT NOMBRE_CLIENTE , CORREO FROM USUARIO WHERE COD_USUARIO = {COD}"
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        user = cursor.execute(queryGetUsuario)
        Correo = ''
        Usuario = ''
        for x in cursor:
            Correo = x[0]
            Usuario = x[1]
        
        queryGetUsuario = "SELECT TOP 1  CORREO FROM USUARIO WHERE COD_ROL = 1 AND COD_USUARIO <> 23  ORDER BY NEWID()"
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        user = cursor.execute(queryGetUsuario)
        getuser = ''
        for x in user:
            getuser = x[0]
        remitente = 'soporte@kyros.cl'
        destinatarios = [str(getuser)]
        asunto = 'Soporte Kyros'
        cuerpo = (f"<span class='col'>Estimado usuario </span><br><br>"
                    f"<span class='col' >.</span><br><br>"
                    f"<span class='col'>El cliente {Usuario} con correo {Correo} ha craedo un ticket con un contrato no vinculado en sap. </span><br><br>"
                    f"<img src='https://i.ibb.co/R2QJwTM/soporte.jpg' alt=''>")
        
        mensaje = MIMEMultipart()
        mensaje['From'] = remitente
        mensaje['To'] = ", ".join(destinatarios)
        mensaje['Subject'] = asunto
        mensaje.attach(MIMEText(cuerpo, 'html'))
        sesion_smtp = smtplib.SMTP('smtp.gmail.com', 587)
        sesion_smtp.starttls()
        sesion_smtp.login('soporte@kyros.cl','soporte2016_')
        texto = mensaje.as_string()
        sesion_smtp.sendmail(remitente, destinatarios, texto )
        sesion_smtp.quit()
        return HttpResponse(json.dumps('ERROR ENVIADO').encode('utf8'),status=status.HTTP_200_OK)
