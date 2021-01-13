$( document ).ready(function() {
    COD_CLIENTE = localStorage['CODIGO_USUARIO'];
    X = localStorage['COD_CLIENTE'];
    if(!localStorage['CODIGO_USUARIO']) return   location.href ="http://localhost:8000/";
    if(localStorage['COD_ROL'] != 3 ){
        return   location.href ="http://localhost:8000/";
    }  
    ListarNotifacionesCliente();
    setInterval('ListarNotifacionesCliente()',3000)
    ListarDatosCliente();
    ListarContratos();
    ListarSolicitudesClienteDatos();

    
});



const ListarSolicitudesClienteDatos = () => {

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/${COD_CLIENTE}/1/1/1`,
        type: "GET",
        dataType: 'json',
        success: function (rs){

            var TotalNuevos = 0 ;
            var TotalUrgentes = 0 ;
            var TotalProceso = 0 ;
            var TotalEfectuados = 0 ; 

            $.each(rs , function(i,v){
                TotalEfectuados++
                var estado = (v.ESTADO).toString();    
                var nivel = (v.NIVEL_URGENCIA).toString();     
                if(estado == "1"){TotalNuevos++}  
                if(estado != "6" && estado != "1"  ){TotalProceso++}  
                if(nivel == "Alto"){TotalUrgentes++}  
            });

            $('#Nuevos').text(TotalNuevos);
            $('#Urgente').text(TotalUrgentes);
            $('#Proceso').text(TotalProceso);
            $('#Efectuados').text(TotalEfectuados);

        }
    });

}

const ListarContratos = () => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/contrato/sap/${X}`,
        type: "GET",
        dataType: 'json',
        success: function (rs){
            var div = $('#MisContratos');
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
        }
    });
    
}

const downloadFile = (z) =>{

    window.location.href =`http://localhost:8000/media/${z}`;
}

const ListarDatosCliente = () => {

    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/usuario/${COD_CLIENTE}`,
        type: "GET",
        dataType: 'json',
        success: function (res){
            localStorage['CORREO'] = res[0].CORREO
            var ROL = '';
      
            if(localStorage['COD_ROL'] == 3){ROL = 'Cliente' }
  
            localStorage['USUARIO'] = res[0].NOMBRE_CLIENTE
            $('#cliente').html(`${res[0].NOMBRE_CLIENTE} - ${res[0].CORREO} - ${ROL} ` );
        },error: function (err){
            
        },
    });

}


const Cerrar = () => {
    location.href ="http://localhost:8000/";
    localStorage.clear();
}


const ListarNotifacionesCliente = () => {
//
//        $.ajax({
//
//            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
//            url: `http://localhost:8000/api/mensajes/TOTAL/CLIENTE/NOTIFICACIONES/${COD_CLIENTE}`,
//            type: "GET",
//            dataType: 'json',
//            success: function (rs){
//                $('#NotificacionesClienteTotal').text(rs);
//                
//            }
//        });
//    
//    
        $.ajax({
    
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/mensajes/TOTAL/CLIENTE/${COD_CLIENTE}`,
            type: "GET",
            dataType: 'json',
            success: function (rs){
    
                $('#TotalMensaje').text(rs);
                
            }
        });
    
}

//const AbrirNotificaciones = () => {
//
//    $('#CONTENEDOR_NOTIFICACIONES a').remove();
//
//    $.ajax({
//
//        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
//        url: `http://localhost:8000/api/mensajes/TOTAL/DESCRIPCION/${COD_CLIENTE}`,
//        type: "GET",
//        dataType: 'json',
//        success: function (rs){
//
//            var tabla = $('#CONTENEDOR_NOTIFICACIONES');
//            var filas = '';
//
//         
//         
//            $.each(rs, function( i, v ) {
//               
//                filas +=  
//                `<div>
//
//                    <a class="dropdown-item d-flex align-items-center" href="http://localhost:8000/cliente/solicitudes/" >
// 
//                        <div class="font-weight-bold">
//                            <div class="text-truncate">Cantidad ${v.CANTIDAD} notificaciones. </div>
//                            <div class="small text-gray-500">Tu ticket numero ${v.COD} esta revisión </div>
//                        </div>
//
//                    </a>
//
//                </div> `;
//
//            });
//
//            tabla.append(filas);
//
//        },error : function (err){
//           
//        }
//    });
//
//}

const AbrirMensajes = () => {

    $('#ContenedoMensajes a').remove();
    
    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/mensajes/TOTAL/SOLICITUD/CLIENTE/${COD_CLIENTE}`,
        type: "GET",
        dataType: 'json',
        success: function (rs){

            var tabla = $('#ContenedoMensajes');
            var filas = '';
         
            $.each(rs, function( i, v ) {
                filas +=  
                `<div>
                    <a class="dropdown-item d-flex align-items-center"  href="http://localhost:8000/cliente/solicitudes/" >
                        <div class="font-weight-bold">
                            <div class="text-truncate">Cantidad ${v.CANTIDAD} mensajes. </div>
                            <div class="small text-gray-500">Tienes  ${v.CANTIDAD} mensajes en el ticket numero ${v.COD} </div>
                        </div>
                    </a>
                </div> `;
            });
            tabla.append(filas);
        }
    });

}