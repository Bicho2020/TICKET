$( document ).ready(function() {

    COD_ADMINISTRADOR = localStorage['CODIGO_USUARIO'];
    if(!localStorage['CODIGO_USUARIO']) return   location.href ="http://localhost:8000/";
    if(localStorage['COD_ROL'] != '1') return   location.href ="http://localhost:8000/";
    ListarDatosCliente();
    ListarNotifaciones();
    ListarSolicitudesAdmin();
});

const ListarSolicitudesAdmin = () => {

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket`,
        type: "GET",
        dataType: 'json',
        success: function (rs){

            var TotalNuevos = 0 ;
      
            var TotalProceso = 0 ;
            var TotalEfectuados = 0 ; 
            var TotalCerrados = 0;

            $.each(rs , function(i,v){
                TotalEfectuados++
                var estado = (v.ESTADO).toString();    
                if(estado == "1"){TotalNuevos++}  
                if(estado != "6" && estado != "1" ){TotalProceso++}  
                if(estado == "6"){TotalCerrados++}  
         
            });
    
            $('#Nuevos').text(TotalNuevos);
          
            $('#Proceso').text(TotalProceso);
            $('#Efectuados').text(TotalEfectuados);
            $('#Cerrados').text(TotalCerrados);

        }
    });

}

const ListarDatosCliente = () => {

    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/usuario/${COD_ADMINISTRADOR}`,
        type: "GET",
        dataType: 'json',
        success: function (res){
            var ROL = '';
            if(localStorage['COD_ROL'] == 1){ ROL = 'Administrador' }
            if(localStorage['COD_ROL'] == 2){ROL = 'Soporte' }
            if(localStorage['COD_ROL'] == 3){ROL = 'Cliente' }
            if(localStorage['COD_ROL'] == 4){ROL = 'Área desarrollo' }
            if(localStorage['COD_ROL'] == 5){ROL = 'Área soporte' }
            if(localStorage['COD_ROL'] == 6){ROL = 'Área consultoria' }
            if(localStorage['COD_ROL'] == 7){ROL = 'Área parnet' }
  
            $('#cliente').html(`${res[0].NOMBRE_CLIENTE} - ${res[0].CORREO} - ${ROL} ` );
            
        },error: function (err){
            
        },
    });

}

const Cerrar = () => {
    location.href ="http://localhost:8000/";
    localStorage.clear();
}


const ListarNotifaciones = () => {
    var ESTADO_CREADO = 0;
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/estado`,
        type: "GET",
        dataType:'json',
        async:false,
        success: function (rs){
            $.each(rs , function(i,v){
                if(parseInt(v.COD_OPERACION) == 5 && parseInt(v.ES_ESCALADO) == 0 ){
                    ESTADO_CREADO = v.CODIGO_SAP;
                }
            });
        }
    });

    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/mensajes/NOTIFICACION/SOPORTE/${COD_ADMINISTRADOR}/${ESTADO_CREADO}`,
        type: "GET",
        dataType: 'json',
        success: function (rs){
            $('#Notificiones').text(rs);
            if(rs == '1'){
                $('#Notificiones2').text(' Tienes 1 solicitud en espera por asignar.');
            }else{
                $('#Notificiones2').text(' Tienes '+rs+' solicitudes en espera por asignar.');
            }
          
        }
    });



}