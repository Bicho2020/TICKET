
from django.contrib import admin
from django.urls import path , include
from .views import login , administrador_gestion_estado , administrador_rol , home_administrador , home_usuarios , home_crear_usuario , home_soporte , home_soporte_solicitudes
from .views import home_ticket_admi , administrador_soluciones ,  home_cliente , home_cliente_solicitud , home_cliente_solicitudes , home_contratos_admi , home_administrador_modificar_contratos
from core.api import usuario
from core.api import ticket
from core.api import mensajes
from core.api import contrato
from core.api import reporteria
from core.api import rol
from core.api import estados

urlpatterns = [

    path('', login , name="login"),
    path('administrador/resolucion/', administrador_soluciones , name="administrador_soluciones"),
    path('administrador/home/', home_administrador , name="home_administrador"),
    path('administrador/estados/', administrador_gestion_estado , name="administrador_gestion_estado"),
    path('administrador/rol/', administrador_rol , name="administrador_rol"),
    path('administrador/registrar/', home_crear_usuario , name="home_crear_usuario"),
    path('administrador/usuarios/', home_usuarios , name="home_usuarios"),
    path('administrador/contratos/', home_contratos_admi , name="home_contratos_admi"),
    path('administrador/ticket/', home_ticket_admi , name="home_ticket_admi"),
    path('administrador/contratos/modificar', home_administrador_modificar_contratos , name="home_administrador_modificar_contratos"),
    path('soporte/home/', home_soporte , name="home_soporte"),
    path('soporte/solicitudes/', home_soporte_solicitudes , name="home_soporte_solicitudes"),
    path('cliente/home/', home_cliente , name="home_cliente"),
    path('cliente/solicitud/', home_cliente_solicitud , name="home_cliente_solicitud"),
    path('cliente/solicitudes/', home_cliente_solicitudes , name="home_cliente_solicitudes"),
    path('api/usuario/cliente/sap', usuario.ClienteSAP.as_view()),
    path('api/usuario/cliente/sap/<pk>', usuario.ClienteContactoSAP.as_view()),
    path('api/usuario', usuario.Usuario.as_view()),
    path('api/usuario/<pk>/<estado>', usuario.Modificar.as_view()),
    path('api/usuario/LOGIN/<CORREO>/<PASSWD>', usuario.Login.as_view()),
    path('api/usuario/<pk>', usuario.FiltrarUsuario.as_view()),
    path('api/usuario/verificar/contrato/<pk>', usuario.VerificarLoginContrato.as_view()),
    path('api/ticket/ADJUNTO/<pk>', ticket.Imagen.as_view()),
    path('api/ticket/<pk>/<tipo>/<f>/<o>', ticket.Solicitudes.as_view()),
    path('api/ticket/CLIENTE/ACTUALIZAR/VISTO/TODO/<pk>', ticket.ActualizarVistoCliente.as_view()),
    path('api/ticket/CLIENTE/ACTUALIZAR/VISTO/MENSAJE/<pk>/<tk>', ticket.VistoCliente.as_view()),
    path('api/ticket', ticket.GuadarTicket.as_view()),
    path('api/ticket/soliciones', ticket.Soluciones.as_view()),
    path('api/ticket/enviar/resolucion/sap/<ct>/<rs>', ticket.EnviarResolucionSap.as_view()),
    path('api/ticket/soporte', ticket.ListarSoporte.as_view()),
    path('api/ticket/contrato/sap/<pk>', contrato.TicketMisContratos.as_view()),
    path('api/ticket/asignacion/<CS>/<CT>', ticket.AsignarSoporte.as_view()),
    path('api/ticket/resolucion/envio/cliente/N/<CT>/<RS>/<H>/<FC>/<HC>/<AD>', ticket.Resolucion.as_view()),
    path('api/ticket/resolucion/listar/<pk>', ticket.ListarResolucion.as_view()),
    path('api/ticket/resolucion/envio/soporte/area/<CT>/<RS>/<H>/<TP>/<FC>/<HC>/<AD>', ticket.ResolucionSoporte.as_view()), #
    path('api/ticket/resolucion/listar/soporte/area/<pk>', ticket.ListarResolucionSoporte.as_view()), #
    path('api/ticket/total/sugerencia/contar/crecion/<asun>/<desc>', ticket.Sugrencia.as_view()),
    path('api/ticket/total/sugerencia/lista/x/<asun>/<desc>', ticket.SugrenciaLista.as_view()),
    path('api/mensajes/<pk>', mensajes.FiltrarMSJ.as_view()),
    path('api/mensajes/NOTIFICACION/SOPORTE/<pk>/<eT>', mensajes.NotificacionesSoporte.as_view()),
    path('api/mensajes/TOTAL/SOPORTE/<pk>', mensajes.MensajesSinVerSoporte.as_view()),
    path('api/mensajes/TOTAL/CLIENTE/<pk>', mensajes.MensajesSinVerCLIENTE.as_view()),
    path('api/mensajes/TOTAL/SOLICITUD/SOPORTE/<pk>', mensajes.MensajesSinVerXsolicitud.as_view()),
    path('api/mensajes/TOTAL/SOLICITUD/CLIENTE/<pk>', mensajes.MensajesSinVerXsolicitudcLIENTE.as_view()),
    path('api/mensajes/TOTAL/SOLICITUD/AREA/<pk>', mensajes.MensajesSinVerXArea.as_view()),
    path('api/mensajes/TOTAL/CLIENTE/NOTIFICACIONES/<pk>', mensajes.NOTIFICACIONES_CLIENTE.as_view()),
    path('api/mensajes/TOTAL/DESCRIPCION/<pk>', mensajes.NOTIFICACION_DESCRIPCION_CLIENTE.as_view()),
    path('api/mensajes/<pk>/<tk>', mensajes.VistoSoporte.as_view()),
    path('api/mensajes', mensajes.EnviarMensaje.as_view()),
    path('api/contrato', contrato.ContratoCRUD.as_view()),
    path('api/contrato/descontar/horas/<pk>/<hr>', contrato.DescontarHorasContratos.as_view()),
    path('api/contrato/<pk>', contrato.contratoEliminar.as_view()),
    path('api/contrato/numero/sap', contrato.ContratosNUMEROSAP.as_view()),
    path('api/contrato/sap/<pk>', contrato.ContratoSAP.as_view()),
    path('api/contrato/horas/<pk>', contrato.HorasRestantes.as_view()),
    path('api/contrato/adjunto/<pk>', contrato.AdjuntoContrato.as_view()),
    path('api/notificacion/area/mensaje/total/<CA>/<ET>', mensajes.NotificacionMensajeTotalArea.as_view()),
    path('api/notificacion/area/total/<CA>/<ET>', mensajes.NotificacionTotalArea.as_view()),
    path('api/reporteria/TOP_3_TIPO_PROBLEMA/<pk>', reporteria.TOP_3_TIPO_PROBLEMA.as_view()),
    path('api/reporteria/TOP_3_TIPO_CONTRATO/<pk>', reporteria.TOP_3_TIPO_CONTRATO.as_view()),
    path('api/usuario/ASIGNAR_ESCALADO/UPDATE/TICKET/<pk>/<ct>', usuario.ASIGNAR_ESCALADO.as_view()),
    path('api/usuario/LISTAR_USUARIO_ASIGNACION/B/<pk>', usuario.LISTAR_USUARIO_ASIGNACION.as_view()),
    path('api/reporteria/TIPO_CONTRATO/', reporteria.TOP_TIPO_CONTRATO.as_view()),
    path('api/reporteria/TIPO_PROBLEMA/', reporteria.TOP_TIPO_PROBLEMA.as_view()),
    path('api/LISTAR/TODO/TIPO_PROBLEMA/DESDE/SAP', ticket.ListarTipoProblema.as_view()),
    path('api/TRAER/COD_PERSONA_CONTACTO/<CPC>', ticket.CodPersonaContacto.as_view()),
    path('api/roles', rol.ROLES.as_view()),
    path('api/roles/<pk>', rol.ROLES_ELIMINAR.as_view()),
    path('api/roles/codigo/sap/<pk>', rol.LISTAR_COD_SAP_SEGUN_ROL_SOPORTE_AREA.as_view()),
    path('api/estado', estados.Estado.as_view()),
    path('api/rol/usuario/<pk>', rol.SELECCIONAR_ROL_USUARIO.as_view()),
    path('api/ticket/enviar/correo/asignacion/<CS>/<CT>', ticket.EnviarCorreo.as_view()),
    path('api/ticket/enviar/correo/usuario/estado/<CT>/<EST>', ticket.EnviarCorreoSoporte.as_view()),
    path('api/ticket/cerrar/ticket/sap/<ct>/<hh>', ticket.HoraTicketSap.as_view()),
    path('api/usuario/traer/telefono/usuario/<CT>', usuario.TraerTelefono.as_view()),
    path('api/ticket/crear/pdf/finalizado/<ct>/<hh>', ticket.PDF.as_view()),
    path('api/ticket/error/<COD>', ticket.EnviarErrorCreacionTicket.as_view()),
]
