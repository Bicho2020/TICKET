from django.shortcuts import render

def login(request):
    return render(request,'core/Login.html')

def home_administrador(request):
    return render(request,'core/Administrador/home.html')

def home_crear_usuario(request):
    return render(request,'core/Administrador/crear_usuario.html')

def home_usuarios(request):
    return render(request,'core/Administrador/listar_usuarios.html')

def home_contratos_admi(request):
    return render(request,'core/Administrador/contratos.html')

def home_ticket_admi(request):
    return render(request,'core/Administrador/ticket.html')

def home_administrador_modificar_contratos(request):
    return render(request,'core/Administrador/modificar_contratos.html')

def home_soporte(request):
    return render(request,'core/Soporte/home.html')

def home_soporte_solicitudes(request):
    return render(request,'core/Soporte/solicitudes.html')

def home_cliente(request):
    return render(request,'core/Cliente/home.html')

def home_cliente_solicitud(request):
    return render(request,'core/Cliente/registrar_solicitud.html')

def home_cliente_solicitudes(request):
    return render(request,'core/Cliente/solicitudes.html')

def administrador_gestion_estado(request):
    return render(request,'core/Administrador/estados.html')

def administrador_rol(request):
    return render(request,'core/Administrador/roles.html')

def administrador_soluciones(request):
    return render(request,'core/Administrador/soluciones.html')