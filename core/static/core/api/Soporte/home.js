

$( document ).ready(function() {

    ESTADO_G = 0;
    ROL_Y = '';
    COD_SOPORTE = localStorage['CODIGO_USUARIO'];
    
    if(!localStorage['CODIGO_USUARIO']) return   location.href ="http://localhost:8000/";
    if(localStorage['COD_ROL'] == 1 || localStorage['COD_ROL'] == 3 ) return   location.href ="http://localhost:8000/";

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/roles/codigo/sap/${localStorage['COD_ROL']}`,
        type: "GET",
        async:false,
        success: function (rs){
            ESTADO_G = parseInt(rs.replace(/"/g,''));
        }
    });

    ListarNotifaciones();
    setInterval('ListarNotifaciones()',3000);
    ListarSolicitudesSoporteDatos();
    ListarContratos();
    ListarDatosSoporte();
});

const ListarSolicitudesSoporteDatos = () => {

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/${COD_SOPORTE}/2/1/1`,
        type: "GET",
        dataType: 'json',
        success: function (rs){

  
           //
           // var TotalNuevos = 0 ;
           // var TotalUrgentes = 0 ;
           // var TotalProceso = 0 ;
           // var TotalEfectuados = 0 ; 
           // var TotalEscalados = 0;
           // var desarrollo = 0;
           // var soporte = 0;
           // var consultoria = 0;
           // var parnet = 0;
//
           // $.each(rs , function(i,v){
           //     TotalEfectuados++
           //     var estado = (v.ESTADO).toString();    
           //     var nivel = (v.NIVEL_URGENCIA).toString();     
           //     if(estado == "1"){TotalNuevos++}  
           //     if(estado != "6"){TotalProceso++}  
           //     if(estado == "6"){TotalUrgentes++}  
           //     if(estado == "03A"){TotalEscalados++ , desarrollo++}  
           //     if(estado == "03B"){TotalEscalados++ , soporte++}  
           //     if(estado == "03C"){TotalEscalados++ , consultoria++}  
           //     if(estado == "03D"){TotalEscalados++ , parnet++}  
           //    
           // });
//
           // $('#Nuevos').text(TotalNuevos);
           // $('#Urgente').text(TotalUrgentes);
           // $('#Proceso').text(TotalProceso);
           // $('#Efectuados').text(TotalEfectuados);
           // $('#Escalados').text(TotalEscalados);
           // 
           // $('#Desarrollo').text(desarrollo);
           // $('#Soporte').text(soporte);
           // $('#Consultoria').text(consultoria);
           // $('#Parnet').text(parnet);

        }
    });

}

const ListarContratos = () => {
    
    $('#ListarContratos > tr > td').remove();

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/contrato`,
        type: "GET",
        dataType: 'json',
        success: function (rs){
            var div = $('#ListarContratos');
            var fila = '';
            console.log(rs);
            $.each(rs , function (i,v){
                var DS = '';
                var CL = 'text-primary';
                var tipo = v.TIPO_PERIODO;
                if(tipo == '1'){tipo='Mensual'}else{tipo='Anual'}
                if(v.ADJUNTO == 'SIN ADJUNTO'){DS = 'DISABLED' , CL = 'text-dark'}
                fila += `
                <tr>
                    <td class="pt-3">${v.TIPO_CONTRATO}</td>
                    <td class="pt-3">${v.FECHA_INICIO_CONTRATO}</td>
                    <td class="pt-3">${v.FECHA_TERMINO_CONTRATO}</td>
                    <td class="pt-3">${tipo}</td>
                    <td class="pt-3">${v.HORAS}</td>
                    <td class="pt-3">${v.HORAS_RESTANTES}</td>
                    <td><button  onclick="downloadFile('${v.ADJUNTO}')"  type="button" ${DS} class="btn btn-default btn-sm w-100 p-0" aria-label="Left Align">
                    <span style="font-size:25px" class="fas fa-file-download ${CL}" aria-hidden="true"></span>
                    </button</td>
                </tr>`;
               
            });
            div.append(fila);
        },
        error: function (){
            Swal.fire({
                icon: 'error',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });
}

const downloadFile = (z) =>{

    window.location.href =`http://localhost:8000/media/${z}`;
}


const ListarDatosSoporte = () => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/usuario/${COD_SOPORTE}`,
        type: "GET",
        dataType: 'json',
        success: function (res){
            var COD_ROL = res[0].COD_ROL;
             
            $.ajax({
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                url: `http://localhost:8000/api/rol/usuario/${COD_ROL}`,
                type: "GET",
                async:false,
                success: function (rs){
                    ROL_Y = rs.replace(/"/g,'')
                    localStorage['ROL_Y'] = ROL_Y;
                }
            });
            $('#cliente').html(`${res[0].NOMBRE_CLIENTE} - ${res[0].CORREO} - ${localStorage['ROL_Y']}  ` );
        }
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

    if(localStorage['COD_ROL'] == 2 ){

        
        $.ajax({

            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/mensajes/NOTIFICACION/SOPORTE/${COD_SOPORTE}/${ESTADO_CREADO}`,
            type: "GET",
            dataType: 'json',
            success: function (rs){
                $('#Notificiones').text(rs);
                if(rs == '1'){
                    $('#Notificiones2').text(' Tienes 1 solicitud en espera.');
                }else{
                    $('#Notificiones2').text(' Tienes '+rs+' solicitudes en espera.');
                }
            
            }
        });

        $.ajax({

            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/mensajes/TOTAL/SOPORTE/${COD_SOPORTE}`,
            type: "GET",
            dataType: 'json',
            success: function (rs){
                $('#TotalMensajes').text(rs);
        
            }
        });

    } 
else{
   
    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/notificacion/area/total/${COD_SOPORTE}/${ESTADO_G}`,
        type: "GET",
        dataType: 'json',
        async:false,
        success: function (rs){
            $('#Notificiones').text(rs);
            if(rs == '1'){
                $('#Notificiones2').text(' Tienes 1 solicitud en espera.');
            }else{
                $('#Notificiones2').text(' Tienes '+rs+' solicitudes en espera.');
            }
            
        }
    });

    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/notificacion/area/mensaje/total/${COD_SOPORTE}/${ESTADO_G}`,
        type: "GET",
        dataType: 'json',
        success: function (rs){

            $('#TotalMensajes').text(rs);
            
        }
    });
}

}

const ListarMensajes = () => {


    $('#CONTENEDOR_MENSAJES a').remove();


    if(localStorage['COD_ROL'] == 2){
        $.ajax({

            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/mensajes/TOTAL/SOLICITUD/SOPORTE/${COD_SOPORTE}`,
            type: "GET",
            dataType: 'json',
            success: function (rs){
    
                var tabla = $('#CONTENEDOR_MENSAJES');
                var filas = '';
    
                $.each(rs, function( i, v ) {
    
    
                    filas +=  
                    `<div>
    
                        <a href="http://localhost:8000/soporte/solicitudes/" class="dropdown-item d-flex align-items-center" >
     
                            <div class="font-weight-bold">
                                <div class="text-truncate">Cantidad ${v.CANTIDAD} mensajes. </div>
                                <div class="small text-gray-500">Tienes mensajes del ticket numero ${v.COD} </div>
                            </div>
    
                        </a>
    
            
    
                    </div> `;
    
                });
    
                tabla.append(filas);
    
          
            }
        });
    } else {
        $.ajax({

            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/mensajes/TOTAL/SOLICITUD/AREA/${COD_SOPORTE}`,
            type: "GET",
            dataType: 'json',
            success: function (rs){
    
                var tabla = $('#CONTENEDOR_MENSAJES');
                var filas = '';
    
                $.each(rs, function( i, v ) {
    
    
                    filas +=  
                    `<div>
    
                        <a class="dropdown-item d-flex align-items-center" >
     
                            <div class="font-weight-bold">
                                <div class="text-truncate">Cantidad ${v.CANTIDAD} mensajes. </div>
                                <div class="small text-gray-500">Tienes mensajes del ticket numero ${v.COD} </div>
                            </div>
    
                        </a>
    
            
    
                    </div> `;
    
                });
    
                tabla.append(filas);
   
            }
        });
    }    
}


