$( document ).ready(function() {
    CodAsignacionContrato = 1;
    GcodigoUsuario = localStorage['CODIGO_USUARIO'];
    ListarSolicitudesCliente(1,1);
    LimpiarNoti();
    white = 0;
    setInterval('White()', 4000);
});

const White = () => {
    var x  = $(`#ModalMsj${white}`).is(':visible');
    if(x == true){
        AbrirMensajeria(white);
    }
}

const LimpiarNoti = () => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/CLIENTE/ACTUALIZAR/VISTO/TODO/${GcodigoUsuario}`,
        type: "PUT",
        dataType: 'json'
    });
}

const Filtro = () => {
    var F = $('#filtro').val();
    var V =$('#filtro option:selected').text();
   
    ListarSolicitudesCliente(F,V);

}

const ListarSolicitudesCliente = (F,O) => {

  
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/${GcodigoUsuario}/1/${F}/${O}`,
        type: "GET",
        dataType: 'json',
        async:false,
        success: function (rs){
            $(`#TablaSolicitudes > tbody > tr > td`).remove();
            tabla = $(`#TablaSolicitudes > tbody`);
            filas = ``;
            var TotalNuevos = 0 ;
            var TotalRevision = 0 ;
            var TotalEscalados = 0 ;
            var TotalResolucion = 0 ;

            var ESTADO_CREADO = 0;
            var ESTADO_ESCALADO = []
            var ESTADO_RESOLUCION = 0;
            var ESTADO_FINALIZADO = 0;
            var SIN_OPERACION = 0;
            var NOMBRE_OPERACION = '';

            $.ajax({
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                url: `http://localhost:8000/api/estado`,
                type: "GET",
                dataType:'json',
                async:false,
                success: function (rs){
               
                    $.each(rs , function(i,v){
                        
                        if(parseInt(v.COD_OPERACION) == 1){
                            ESTADO_FINALIZADO = v.CODIGO_SAP;
                        }
                        if(parseInt(v.COD_OPERACION) == 4){
                            SIN_OPERACION = v.CODIGO_SAP;
                            NOMBRE_OPERACION = v.ESTADO_NOMBRE
                        }
                        if(parseInt(v.COD_OPERACION) == 3){
                            ESTADO_RESOLUCION = (v.CODIGO_SAP);
                        }
                        if(parseInt(v.ES_ESCALADO) == 1){
                            ESTADO_ESCALADO.push(v.CODIGO_SAP);
                           
                        }
                        if(parseInt(v.COD_OPERACION) == 5 && parseInt(v.ES_ESCALADO) == 0 ){
                            ESTADO_CREADO = v.CODIGO_SAP;
                        }
                    });
                }
            });
            $.each(rs, function (i, x) {

                var ESTADO_ = x.ESTADO;

                $.ajax({
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    url: `http://localhost:8000/api/estado`,
                    type: "GET",
                    dataType:'json',
                    async:false,
                    success: function (rs){
                        $.each(rs , function(i,v){   
                            if(parseInt(v.CODIGO_SAP) == ESTADO_){
                                ESTADO_ = v.ESTADO_NOMBRE;
                            }
                        });
                    }
                });

                var COLOR = "";
                var COLOR_ESTADO = "";
                var SEMAFORO = '<i  class="fas text-success fa-circle"><span style="font-size:0px">1</span></i>';
                if(x.NIVEL_URGENCIA == "Medio"){ COLOR = "text-warning"} ;
                if(x.NIVEL_URGENCIA == "Alto"){ COLOR = "text-danger"} ;
                if(x.NIVEL_URGENCIA == "Bajo"){ COLOR = "text-success"} ;
                var DISABLED = '';
                var ESTADO = x.ESTADO;
                var EST_CLOSE = 'disabled'
                var EST_RES = 'disabled'
                var COLOR_CLOSE = 'text-secondary'
                var COLOR_RES = 'text-secondary'
                var BTNDISABLE = 'hidden';
                var COMENTARY = x.COMENTARIO;
                var COLOR_TICKET = 'text-primary';
                var DISABLED_TICKET = '';
                if(ESTADO == SIN_OPERACION){}
                if(ESTADO == ESTADO_CREADO){ EST_CLOSE = '' , COLOR_CLOSE = 'text-danger' , TotalNuevos++ }
                if(ESTADO == '2'){ TotalRevision++}
                if(ESTADO_ESCALADO.indexOf(ESTADO) >= 0){  TotalEscalados++}
                if(ESTADO == '4'){ESTADO = 'Proceso de verificación'}
                if(ESTADO == ESTADO_RESOLUCION){EST_RES = '' ,  COLOR_RES = 'text-primary',TotalResolucion++}
                if(ESTADO == ESTADO_FINALIZADO){ EST_RES = '' ,   COLOR_RES = 'text-primary' , DISABLED = 'disabled' , SEMAFORO = '<i  class="fas text-danger fa-circle"><span style="font-size:0px" >2</span></i>'}
                if(x.COMENTARIO.length >= 30){ BTNDISABLE = '' , COMENTARY =''}
                if(x.ADJUNTO == null){COLOR_TICKET='text-secondary',DISABLED_TICKET='disabled'}
                filas += `
                <tr>
                    <td >${SEMAFORO}</td>
                    <td scope="row">${x.COD_TICKET}</td>
                    <td>${x.SOPORTE}</td>
                    <td>${x.FECHA_SOLICITUD}</td>
                    <td>${x.HORA_SOLICITUD}</td>
                    <td> <span class="${COLOR}"> ${x.NIVEL_URGENCIA} </span> </td>
                    <td>${x.TIPO_PROBLEMA}</td>
                    <td>${COMENTARY} <button ${BTNDISABLE} type="button" class="btn btn-default btn-sm p-0" data-toggle="modal" data-target="#Com${x.COD_TICKET}">
                    <i class="fas text-primary fa-comment-alt"></i>
                    </button>
                    <div class="modal fade" id="Com${x.COD_TICKET}" tabindex="-1" role="dialog"  aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLongTitle">Descripción problema</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                        <div class="alert alert-success text-left" role="alert">
                        <h6>${x.COMENTARIO}</h6>
                        </div>
                        </div>
                      </div>
                    </div>
                     </div>
                    </td>
                 
                    <td  font-weight-bold" >${ESTADO_}</td>

                    <td> <a href="" data-toggle="modal"  data-target="#ModalFoto${x.COD_TICKET}" > <img height="20px" src="http://localhost:8000/static/core/img/galeria.png"" " alt=""> </a>
                    
                    <div class="modal fade" id="ModalFoto${x.COD_TICKET}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">ADJUNTO</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                        
                            <img class="rounded shadow" src="http://localhost:8000/media/${x.URL_ADJUNTO}" width="100%" alt="">
                             <a class="btn btn-primary w-100 shadow border  mt-1" href="http://localhost:8000/media/${x.URL_ADJUNTO}" download>Descargar</a>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger " data-dismiss="modal">cerrar</button>
                           
                        </div>
                        </div>
                    </div>
                    </div>

                    </td>
                    <td> <a href=""  onclick="AbrirMensajeriaRELOAD('${x.COD_TICKET}')" data-toggle="modal" data-target="#ModalMsj${x.COD_TICKET}" > <img  height="20px"  src="http://localhost:8000/static/core/img/charlar.png"  alt=""> </a>
                    
                    <div class="modal fade" id="ModalMsj${x.COD_TICKET}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-xl" role="document">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">MENSAJES</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body" >

                        <div class="text-left">
                               <h6>Ticket  numero <span class="text-danger">${x.COD_TICKET}</span> , ejecutivo a cargo <span class="text-success" > ${x.SOPORTE}</span><h6>
                               <h6 >Asunto: <span class="text-success">${x.DESCRIPCION}</span><h6>
                               <h6 >Descripción: <span class="text-success">${x.COMENTARIO}</span><h6>
                               <h6 >Estado: <span class="text-warning">${ESTADO_}</span><h6>
                            </div>
                           
                        <div class="p-3 mt-3 rounded border" ">
                                
                        <div>

                        <div class="container"  contenteditable="false" disabled style="overflow-y: scroll;  height:340px" id="SCROLL${x.COD_TICKET}"  >

                            <div class="row" id="contenedor${x.COD_TICKET}">
                            
                            </div>
                        
                        </div>

                    </div>

                    </div>


                        <div class="row mt-3">

    
                            <div class="col-12">
                                <textarea ${DISABLED} name="mensaje${x.COD_TICKET}" id="mensaje${x.COD_TICKET}" class="w-100 form-control" cols="3" rows="3"></textarea>
                            </div>

                            <div class="col-12 text-right">
                                <input ${DISABLED} type="file" id="FOTO${x.COD_TICKET}" class="form-control-file pt-2" name="files" size="1" multiple >
                                <button ${DISABLED} type="button" onclick="EnviarMensaje('${x.COD_TICKET}')" class="btn btn-primary shadow font-weight-bold w-25 mt-3 " >ENVIAR</button>
                            </div>
                        
                        </div>
                            
                           
                        </div>

                
                        </div>
                    </div>
                    </div>
                    
                    </td>
                    <td> <button onclick="ListarResoluciones(${x.COD_TICKET})" data-toggle="modal" data-target="#mx${x.COD_TICKET}"  id="r${x.COD_TICKET}" ${EST_RES} class="btn btn-sm p-0"  type="button"><i class=" ${COLOR_RES} far fa-eye"> </i> </button>
                        <div class="modal fade bd-example-modal-lg" id="mx${x.COD_TICKET}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Resolución</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                     
                                    <div id="ctd${x.COD_TICKET}">

                                    </div>
                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </td>
                    <td> <button onclick="CancelarTicket('${x.COD_TICKET}','${ESTADO_FINALIZADO}')" id"e${x.COD_TICKET}" ${EST_CLOSE}  class="btn btn-sm p-0"    type="button"> <i  class=" ${COLOR_CLOSE} fas fa-times-circle"></i> </button> </td>
                    <td> <button type="button" ${DISABLED_TICKET} onclick="DescargarTicket('${x.ADJUNTO}')"  class="btn btn-sm p-0" >  <i class="fa fa-ticket ${COLOR_TICKET}" aria-hidden="true"></i> </button> </td>
                </tr>`;
            });
        
            tabla.append(filas);

            $('#TablaSolicitudes').DataTable( 
                {
                    responsive: true,
                    columnDefs: [ {
                        targets: 'CL',
                        orderable: false
                    }],
                    sDom: '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
                    oLanguage: {
                      sLengthMenu: "_MENU_ <span class='pl-3'>filas</span>",
                      sSearch: "Filtrar: ",
                    },
                    language: {
                        info: "_START_ A _END_ FILAS",
                        paginate: {
                            previous: "Anterior",
                            next:"Siguiente"
                          }
                      }
            });
         
            $('#TN').html(TotalNuevos);
            $('#TRV').html(TotalRevision);
            $('#TE').html(TotalEscalados);
            $('#TRS').html(TotalResolucion);
            
        },
        error: function (){
         
            Swal.fire({
                icon: 'error',
                text:'Error con el servidor',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });
    
}

const DescargarTicket = (URL) => {

    window.open(URL); 
}

const ListarResoluciones = (COD_TICKET) => {
    $(`#ctd${COD_TICKET} div`).remove();
    $.ajax({                  
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/resolucion/listar/${COD_TICKET}`,
        type: "GET",
        dataType: 'json',
        success: function (RS){
            var div = $(`#ctd${COD_TICKET}`);
            var cont = '' ;
            if(RS.length == 0){
                cont = 'sin contenido'
            } else {
                $.each(RS, function (x,i) {
                    x = x+1;
                    var adt = '';
                    if(i.ADJUNTO == 0){adt='hidden'}
                    cont += `
                    <div class="alert alert-success text-left rounded border mt-1" role="alert">
                    <h5>Mensaje resolución (${x} ) ${i.FECHA} -  ${i.HORAS}</h5>
                        <textarea disabled class="bg-white form-control mt-3" rows="4">${i.RS}</textarea>
                         <hr class="w-100">
                        <h6>Horas consumidas : <span class="font-weight-bold text-danger" >${i.H}</span> </h6>
                        <div class="mt-2">
                    <a ${adt} class="btn btn-primary border" href="http://localhost:8000/media/${i.ADJUNTO}" Download>Adjunto</a>
                    </div>
                    </div>
                    
                    `;
                });
                div.append(cont);
            }
        },
        error: function (err){
            console.log(err);
            Swal.fire({
                icon: 'error',
                text:'Error con el servidor',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });

}

const CancelarTicket = (COD_TICKET,ESTADO_FINALIZADO) => {

    Swal.fire({
        title: '¿Esta seguro?',
        text: "!Estas seguro que deseas finalizar el ticket ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo finalizar.'
  
    }).then((result) => {
          
        if (result.value) {

            Swal.fire('Porfavor Espere')
            Swal.showLoading()

            if($(`#HorasConsumidas${COD_TICKET}`)){


                $.ajax({
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    url: `http://localhost:8000/api/ticket/${COD_TICKET}/${ESTADO_FINALIZADO}/1/1`,
                    type: "PUT",
                    success: function (){

                        var d = new Date();
                        var Hora = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
                        var Fecha = d.getUTCFullYear() +"-"+ d.getMonth() + 1 +"-"+ d.getDate().toString();
                        
                        const data = [{
                            CODIGO_TICKET : parseInt(COD_TICKET),
                            CODIGO_USUARIO :  parseInt(23),
                            FECHA_MENSAJE : Fecha ,
                            HORA_MENSAJE : Hora,
                            MENSAJE : `Ticket cerrado por el cliente `,
                            ADJUNTO : '0'
                        }]

                        $.ajax({
                        
                            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                            url: `http://localhost:8000/api/mensajes`,
                            type: "POST",
                            dataType: 'json',
                            data : JSON.stringify(data),
                        
                            success: function (){

                                Swal.fire({
                                    icon: 'success',
                                    text:'TICKET CERRADO CON EXITO',
                                    showConfirmButton: false,
                                    timer: 1500
                                });

                                setInterval('location.reload()',1500);
                            
                            
                            },
                            error: function (err){
                                console.log(err);
                                Swal.fire({
                                    icon: 'error',
                                    text:'Error con el servidor',
                                    showConfirmButton: false,
                                    timer: 1200
                                });
                            }
                        });

                    },
                    error: function (err){
                        console.log(err);
                        Swal.fire({
                            icon: 'error',
                            text:'Error con el servidor',
                            showConfirmButton: false,
                            timer: 1200
                        });
                    }
                    
                });
            }
        }
    });

}



    
    

const AbrirMensajeria = (COD) => {
    white = COD;
    VistoMS(COD);
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/mensajes/${COD}`,
        type: "GET",
        dataType: 'json',
        success: function (rs){
            div = $(`#contenedor${COD}`);
            contenedor = ``;
            $.each(rs, function (i, x) {
                if(!$(`#DIV${i}${COD}`).length){

                    if(x.CODIGO_USUARIO == GcodigoUsuario ){
                        if(x.ADJUNTO == '0'){
                            contenedor +=`<div id="DIV${i}${COD}" class="col-lg-6 col-12  ">    
                                <div class="p-2"></div>
                            </div>
                            <div class="col-lg-6 col-12 " >
                                <div class="p-2">
                                    <div class="p-2   bg-primary text-white border rounded row ">
                                        <div class="col-8 text-left"  ><span>${x.COMENTARIO}</span> </div>
                                        <div class="col-4 text-right" ><span>${x.HORA_MENSAJE} (${x.USUARIO}) </div>
                                    </div>
                                </div>
                            </div>`;
                        } else{
                            contenedor += 
                            `<div id="DIV${i}${COD}" class="col-lg-6 col-12 "></div>
                            <div class="col-lg-6 col-12 " >
                                <div class="p-2">
                                    <div class="p-2   bg-primary text-white border rounded row ">
                                        <div class="col-8 text-left"  ><span>${x.COMENTARIO}</span> </div>
                                        <div class="col-4 text-right" ><span>${x.HORA_MENSAJE} (${x.USUARIO})</div>
                                        <div class="text-white rounded mt-2 bg-white"> <a class="text-left btn btn-light border btn-sm " href="http://localhost:8000/media/${x.ADJUNTO}"  download>  Descargar archivo  </a> </div>
                                    </div>
                                </div>
                            </div>`;
                        }
                    } else{

                        if(x.CODIGO_USUARIO == '23' ) {

                            contenedor += `
                           
                            <div id="DIV${i}${COD}" class="col-lg-12 col-12 pt-2   ">   
                                <div >  
                                <div class="alert alert-success" role="alert">
                                ${x.FECHA} -    ${x.HORA_MENSAJE} -  ${x.COMENTARIO}
                                </div>
                                </div>
                            </div>`;
                         
                            
                        } else { 

                        if(x.ADJUNTO == '0'){
                            contenedor += `
                            <div class="col-lg-6 col-12  " >

                                <div class="p-2">
                                    <div class="p-2   bg-light  text-dark border rounded row ">
                                        <div class="col-8 text-left"  ><span>${x.COMENTARIO}</span> </div>
                                        <div class="col-4 text-right" ><span>${x.HORA_MENSAJE} (${x.USUARIO}) </div>
                                    </div>
                                </div>

                            </div>
                            <div id="DIV${i}${COD}" class="col-lg-6 col-12 ">    
                                 <div class="p-2">  
                                 </div>
                            </div>`;
                        } else{
                            contenedor += 
                            `
                            <div class="col-lg-6 col-12 " >
                                <div class="p-2">
                                    <div class="p-2   bg-light  text-dark border rounded row  ">
                                        <div class="col-8 text-left"  ><span>${x.COMENTARIO}</span> </div>
                                        <div class="col-4 text-right" ><span>${x.HORA_MENSAJE} (${x.USUARIO})</div>
                                        <div class="text-white rounded mt-2 bg-white"> <a class="text-left btn btn-success btn-sm border " href="http://localhost:8000/media/${x.ADJUNTO}"  download>  Descargar archivo  </a> </div>
                                    </div>
                                </div>
                            </div>
                            <div id="DIV${i}${COD}" class="col-lg-6 col-12 "></div>`;
                        }
                    }
                    }
                }
            });
            div.append(contenedor);
            
        },
        error: function (err){
     
            Swal.fire({
                icon: 'error',
                text:'Error con el servidor',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });
}


const VistoMS = (COD) => {


    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/CLIENTE/ACTUALIZAR/VISTO/MENSAJE/${GcodigoUsuario}/${COD}`,
        type: "PUT",
        dataType: 'json'
    });

}

const EnviarMensaje = (COD) => {  

    var msj = $(`#mensaje${COD}`).val()
    if(msj != ''){
        if($(`#FOTO${COD}`).val() == ''){
            mensajeSend2(COD);     
        } else{
          GuardarFotoMensaje2(COD);
        }
    }
}



const mensajeSend2 = (COD) => {

    var d = new Date();
    var Hora = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
    var Fecha = d.getUTCFullYear() +"-"+ d.getMonth() + 1 +"-"+ d.getDate().toString();
    
    const data = [{
        CODIGO_TICKET : parseInt(COD),
        CODIGO_USUARIO :  parseInt(GcodigoUsuario),
        FECHA_MENSAJE : Fecha ,
        HORA_MENSAJE : Hora,
        MENSAJE : $(`#mensaje${COD}`).val(),
        ADJUNTO : '0'
    }]

    $.ajax({
    
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/mensajes`,
        type: "POST",
        dataType: 'json',
        data : JSON.stringify(data),
    
        success: function (){
           $(`#mensaje${COD}`).val('');
           
           AbrirMensajeriaRELOAD(COD);
          // $(`#contenedor${COD}`).scrollTop($(`#contenedor${COD}`).prop('scrollHeight')); 
    
        },
        error: function (err){
            
            Swal.fire({
                icon: 'error',
                text:'Error con el servidor',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });

  
}

const GuardarFotoMensaje2 = (COD) => {
  
    var d = new Date();
    var Hora = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
    var Fecha = d.getUTCFullYear() +"-"+ d.getMonth() + 1 +"-"+ d.getDate().toString();

    var input = document.getElementById(`FOTO${COD}`);
    var files = input.files;
    var formData = new FormData();

    for (var i = 0; i != files.length; i++) {
        formData.append("file", files[i]);
    }

    var DATE = d.getUTCFullYear() +""+ d.getMonth() +""+ d.getUTCDate()  +""+ d.getHours() +""+ d.getMinutes() +""+ d.getSeconds();
    var CodAdjunto = DATE + document.getElementById(`FOTO${COD}`).files[0].name
    const data = [{
        CODIGO_TICKET : parseInt(COD),
        CODIGO_USUARIO :  parseInt(GcodigoUsuario),
        FECHA_MENSAJE : Fecha ,
        HORA_MENSAJE : Hora,
        MENSAJE : $(`#mensaje${COD}`).val(),
        ADJUNTO : CodAdjunto
    }]

    $.ajax({
    
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/mensajes`,
        type: "POST",
        dataType: 'json',
        data : JSON.stringify(data),
    
        success: function (){

            $.ajax({

                url: `http://localhost:8000/api/ticket/ADJUNTO/${CodAdjunto}`,
                data: formData,
                type:"POST",
                processData: false,
                contentType: false,
            
                success: function (){
        
                   $(`#mensaje${COD}`).val('');
                
                   AbrirMensajeriaRELOAD(COD);
                   //$(`#contenedor${COD}`).scrollTop($(`#contenedor${COD}`).prop('scrollHeight')); 
                
                   $(`#FOTO${COD}`).val('');
                },
                error: function (err){
                    
                    Swal.fire({
                        icon: 'error',
                        text:'Error con el servidor',
                        showConfirmButton: false,
                        timer: 1200
                    });
                }
            });

        },
        error: function (err){
     
            Swal.fire({
                icon: 'error',
                text:'Error con el servidor',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });

  

}



const AbrirMensajeriaRELOAD = (COD) => {
    white = COD;
    VistoMS(COD);
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/mensajes/${COD}`,
        type: "GET",
        dataType: 'json',
        success: function (rs){
            div = $(`#contenedor${COD}`);
            contenedor = ``;

            $.each(rs, function (i, x) {

                if(!$(`#DIV${i}${COD}`).length){

                    if(x.CODIGO_USUARIO == GcodigoUsuario ){
                        if(x.ADJUNTO == '0'){
                            contenedor +=`<div id="DIV${i}${COD}" class="col-lg-6 col-12  ">    
                                <div class="p-2"></div>
                            </div>

                            <div class="col-lg-6 col-12 " >

                                <div class="p-2">
                                    <div class="p-2   bg-primary text-white border rounded row ">
                                        <div class="col-8 text-left"  ><span>${x.COMENTARIO}</span> </div>
                                        <div class="col-4 text-right" ><span>${x.HORA_MENSAJE} (${x.USUARIO})</div>
                                    </div>
                                </div>

                            </div>`;
                        } else{
                            contenedor += 
                            `<div id="DIV${i}${COD}" class="col-lg-6 col-12 "></div>
                            <div class="col-lg-6 col-12 " >
                                <div class="p-2">
                                    <div class="p-2   bg-primary text-white border rounded row ">
                                        <div class="col-8 text-left"  ><span>${x.COMENTARIO}</span> </div>
                                        <div class="col-4 text-right" ><span>${x.HORA_MENSAJE} (${x.USUARIO})</div>
                                        <div class="text-white rounded mt-2 bg-white"> <a class="text-left btn btn-light border btn-sm " href="http://localhost:8000/media/${x.ADJUNTO}"  download>  Descargar archivo  </a> </div>
                                    </div>
                                </div>
                            </div>`;
                        }
                    } else{

                        if(x.CODIGO_USUARIO == '23' ) {

                            contenedor += `
                           
                            <div id="DIV${i}${COD}" class="col-lg-12 col-12 pt-2   ">   
                                <div >  
                                <div class="alert alert-success" role="alert">
                                ${x.FECHA} -    ${x.HORA_MENSAJE} -  ${x.COMENTARIO}
                                </div>
                                </div>
                            </div>`;
                         
                            
                        } else { 

                        if(x.ADJUNTO == '0'){
                            contenedor += `
                            <div class="col-lg-6 col-12  " >

                                <div class="p-2">
                                    <div class="p-2   bg-light  text-dark border rounded row ">
                                        <div class="col-8 text-left"  ><span>${x.COMENTARIO}</span> </div>
                                        <div class="col-4 text-right" ><span>${x.HORA_MENSAJE} (${x.USUARIO}) </div>
                                    </div>
                                </div>

                            </div>
                            <div id="DIV${i}${COD}" class="col-lg-6 col-12 ">    
                                 <div class="p-2">  
                                 </div>
                            </div>`;
                        } else{
                            contenedor += 
                            `
                            <div class="col-lg-6 col-12 " >
                                <div class="p-2">
                                    <div class="p-2   bg-light  text-dark border rounded row  ">
                                        <div class="col-8 text-left"  ><span>${x.COMENTARIO}</span> </div>
                                        <div class="col-4 text-right" ><span>${x.HORA_MENSAJE} (${x.USUARIO})</div>
                                        <div class="text-white rounded mt-2 bg-white"> <a class="text-left btn btn-success btn-sm border " href="http://localhost:8000/media/${x.ADJUNTO}"  download>  Descargar archivo  </a> </div>
                                    </div>
                                </div>
                            </div>
                            <div id="DIV${i}${COD}" class="col-lg-6 col-12 "></div>`;
                        }

                    }
                    }
                }
            });
            div.append(contenedor);
            $(`#SCROLL${COD}`).stop().animate({ scrollTop: $(`#SCROLL${COD}`)[0].scrollHeight}, 1000);
        },
        error: function (err){
     
            Swal.fire({
                icon: 'error',
                text:'Error con el servidor',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });

    setTimeout(`scrolli2(${COD})`,200);
    

}

const scrolli2 = (COD) => {
  
    $(`#SCROLL${COD}`).scrollTop($(`#SCROLL${COD}`)[0].scrollHeight);
    $(`#SCROLL${COD}`).stop().animate({ scrollTop: $(`#SCROLL${COD}`)[0].scrollHeight}, 1000);
}