$( document ).ready(function() {
    GcodigoUsuario = localStorage['CODIGO_USUARIO'];
    ListarSolicitudes(1,1);
    white = 0;
    setInterval('White()', 1500);
});

const White = () => {
    var x  = $(`#ModalMsj${white}`).is(':visible');
    if(x == true){
        AbrirMensajeria(white);
    }
}


const Filtro = () => {

    var F = $('#filtro').val();
    var V =$('#filtro option:selected').text();

    ListarSolicitudes(F,V);

}

const GetTotal = (COD) => {
    var xTx = '';
    $.ajax({
                        
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/resolucion/listar/soporte/area/${COD}`,
        type: "GET",
        dataType: 'json',
        async:false,
        success: function (rs){
            if(rs.length == 0){
                xTx = 'DISABLED';
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

    return xTx;

}



const ListarResolucionesSoporte = (COD_TICKET) => {
    $(`#ctd${COD_TICKET} div`).remove();
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/resolucion/listar/soporte/area/${COD_TICKET}`,
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
                    alert(i.ADJUNTO);
                    if(i.ADJUNTO == '0'){adt='hidden'}
                    cont += `
                    <div class="alert alert-success text-left rounded border mt-1" role="alert">
                        <h5>Mensaje resolución (${x} por area de ${i.AREA}) ${i.FECHA} -  ${i.HORAS}</h5>
                        <textarea disabled class="bg-white form-control mt-3" rows="4">${i.RS}</textarea>
                         <hr class="w-100">
                        <h6>Horas consumidas : <span style="font-size:20px;" class="font-weight-bold  text-danger" >${i.H}</span> </h6>
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

const ListarSolicitudes = (F,O) => {
    if(localStorage['COD_ROL'] == 2){
        $.ajax({
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/ticket/${GcodigoUsuario}/2/${F}/${O}`,
            type: "GET",
            dataType: 'json',
            success: function (rs){

                var TotalNuevos = 0 ;
                var TotalRevision = 0 ;
                var TotalEscalados = 0 ;
                var TotalResolucion = 0 ;

                $(`#TablaSolicitudes > tbody > tr > td`).remove();
                tabla = $(`#TablaSolicitudes > tbody`);
                filas = ``;

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
                        if(parseInt(v.COD_OPERACION) == 3){
                            ESTADO_RESOLUCION = (v.CODIGO_SAP);
                        
                            
                        }
                        if(parseInt(v.ES_ESCALADO) == 1){
                            ESTADO_ESCALADO.push(v.CODIGO_SAP);
      
                        }
                        if(parseInt(v.COD_OPERACION) == 5 && parseInt(v.ES_ESCALADO) == 0 ){
                            ESTADO_CREADO = v.CODIGO_SAP;
 
                        }

                        if(parseInt(v.COD_OPERACION) == 4){
                            SIN_OPERACION = v.CODIGO_SAP;
                        
                        }
                
                    });
                }
            });

                $.each(rs, function (i, x) {

                    var DISABLED_RS = '';
                    DISABLED_RS = GetTotal(x.COD_TICKET);
                
                    var DISABLED = '';
                    var ESTADO = x.ESTADO;
                    var ESTADO_ = x.ESTADO;
                    var SEMAFORO = '<i   class="fas text-success fa-circle"></i>';
                    var BTNDISABLE = 'hidden';
                    var COMENTARY = x.COMENTARIO;
                    if(ESTADO == SIN_OPERACION){}
                    if(ESTADO == ESTADO_CREADO ){ TotalNuevos++  }
                    if(ESTADO_ESCALADO.indexOf(ESTADO) >= 0){ TotalEscalados++ }
                    if(ESTADO == ESTADO_RESOLUCION){TotalResolucion++   }
                    if(ESTADO == ESTADO_FINALIZADO){    DISABLED = 'disabled' , SEMAFORO = '<i  class="fas text-danger fa-circle"></i>'}
                    if(x.COMENTARIO.length >= 30){ BTNDISABLE = '' , COMENTARY =''}
                
                    filas += `
                    <tr>

                        <td class="pt-3 ">${SEMAFORO}</td>
                        <td class="pt-3">${x.COD_TICKET}</td>
                        <td class="pt-3" >${x.SOPORTE}</td>
                        <td class="pt-3" >${x.FECHA_SOLICITUD}</td>
                        <td class="pt-3">${x.HORA_SOLICITUD}</td>
                        <td class="pt-3">${x.NIVEL_URGENCIA}</td>
                        <td class="pt-3">${x.TIPO_PROBLEMA}</td>
                        <td class="pt-3">${COMENTARY} <button ${BTNDISABLE} type="button" class="btn btn-default btn-sm p-0" data-toggle="modal" data-target="#Com${x.COD_TICKET}">
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
        
                        <td class="pt-3" > <a href="" data-toggle="modal"  data-target="#ModalFoto${x.COD_TICKET}" > <img height="20px" src="http://localhost:8000/static/core/img/galeria.png" " alt=""> </a>
                        
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
                        <td class="pt-3"> <a href="" onclick="AbrirMensajeriaRELOAD2('${x.COD_TICKET}')" data-toggle="modal" data-target="#ModalMsj${x.COD_TICKET}" > <img  height="20px"  src="http://localhost:8000/static/core/img/charlar.png"  alt=""> </a>
                        
                        <div class="modal fade" id="ModalMsj${x.COD_TICKET}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">MENSAJES número telefono (<span id="FONO${x.COD_TICKET}" ></span> )</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div class="modal-body" >
                                <div class="text-left">
                                <h6>Ticket  numero <span class="text-danger">${x.COD_TICKET}</span>  de cliente <span class="text-success" > ${x.SOPORTE}</span><h6>
                                <h6 >Asunto: <span class="text-success">${x.DESCRIPCION}</span><h6>
                                <h6 >Descripción: <span class="text-success">${x.COMENTARIO}</span><h6>
                                <h6 >Estado: <span id="estadomd${x.COD_TICKET}" class="text-warning"></span><h6>
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
                                            
                                            <button data-toggle="modal" style="display:none;" data-target=".bd-example-modal-sm${x.COD_TICKET}" ${DISABLED} type="button" class="btn btn-danger shadow font-weight-bold w-25 mt-3 " >FINALIZAR</button>
                                            <div id="m${x.COD_TICKET}"  class="modal fade bd-example-modal-sm${x.COD_TICKET}" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-centered" role="document">
                                            <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" >Finalizar Ticket</h5>
                                                <button type="button" class="btn " onclick="CerrarModal('${x.COD_TICKET}')" >
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                            <input type="number"  id="HorasConsumidas${x.COD_TICKET}"" class="form-control" required name="price" min="0" value="0" step=".1">
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button"  onclick="Finalizar('${x.COD_TICKET}')" class="btn btn-primary">Listo</button>
                                            </div>
                                            </div>
                                        </div>
                                            </div>
                                            <button ${DISABLED} type="button" onclick="EnviarMensaje('${x.COD_TICKET}')" class="btn btn-primary shadow font-weight-bold w-25 mt-3 " >ENVIAR</button>
                                        </div>
                                
                                    </div>
                                
                            
                            </div>

                    
                            </div>
                        </div>
                        </div>
                        
                        </td>
                        <td > 
                            

                            <div class="d-flex">
                                <select ${DISABLED} id="estado${x.COD_TICKET}" class="form-control p-0 form-control-sm">
                                    
                                </select>
                                <button ${DISABLED}  type="button" onclick="CambiarESTADO('${x.COD_TICKET}',${x.ID_CONTRATO})"  class="btn p-0 ml-2" ><i style="font-size:13px" class="fas fa-redo-alt"></i> </button>
                            </div>

                            
                        </td>
                        <td class="pt-3"><button ${DISABLED_RS}  data-toggle="modal" data-target="#mx${x.COD_TICKET}" onclick="ListarResolucionesSoporte(${x.COD_TICKET})" data-toggle="modal" data-target="#mx${x.COD_TICKET}"  id="r${x.COD_TICKET}"  class="btn text-primary btn-sm p-0"  type="button"><i class="  far fa-eye"> </i> </button>
                        
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

                    </tr>`;

                    $(`#estado${i}`).val(`${x.COD_TICKET}`);

                    $.ajax({
                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                        url: `http://localhost:8000/api/estado`,
                        type: "GET",
                        dataType:'json',
                
                        success: function (rs){
                            var select = $(`#estado${x.COD_TICKET}`);
                            var opt = '';
                            var opt2 = '<optgroup label="Escalados">';
                            $.each(rs , function(i,v){
                                
                                if(parseInt(v.ES_ESCALADO) != 1){
                                    opt += `<option value="${v.CODIGO_SAP}">${v.ESTADO_NOMBRE}</option>`;
                                } else{
                                    opt2 += `<option value="${v.CODIGO_SAP}">${v.ESTADO_NOMBRE}</option>`;                                  
                                }
                            });
                            opt2 +=  "</optgroup>";
                            select.append(opt);
                            select.append(opt2);
                            $(`#estado${x.COD_TICKET}`).val(ESTADO);
                            $(`#estadomd${x.COD_TICKET}`).text($(`#estado${x.COD_TICKET} option:selected`).text());
                        }
                    });
                    $.ajax({
                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                        url: `http://localhost:8000/api/usuario/traer/telefono/usuario/${x.COD_TICKET}`,
                        type: "GET",
                        dataType:'json',
                
                        success: function (rs){
                            $(`#FONO${x.COD_TICKET}`).text(rs);
                        }
                    });
                });

                

                $('#TN').html(TotalNuevos);
                $('#TRV').html(TotalRevision);
                $('#TE').html(TotalEscalados);
                $('#TRS').html(TotalResolucion);
                tabla.append(filas);
                $('#TablaSolicitudes').DataTable({
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
    }else {
   
       var ESTADO_CREADO = 0;
       var ESTADO_ESCALADO = []
       var ESTADO_RESOLUCION = 0;
       var ESTADO_FINALIZADO = 0;

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
       
        $('#etd').text('Enviar resolución');
        $('#etd').css('width',"30px");
        $('#rsc').hide();
  
        $.ajax({

            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/ticket/${GcodigoUsuario}/3/${F}/${O}`,
            type: "GET",
            dataType: 'json',
            success: function (rs){
               
                var TotalNuevos = 0 ;
                var TotalRevision = 0 ;
                var TotalEscalados = 0 ;
                var TotalResolucion = 0 ;

                $(`#TablaSolicitudes > tbody > tr > td`).remove();
                tabla = $(`#TablaSolicitudes > tbody`);
                filas = ``;

                $.each(rs, function (i, x) {

                    if(x.ESTADO == ESTADO_G){
                    
                    var DISABLED = '';
                    var ESTADO = x.ESTADO;
                    var BTNDISABLE = 'hidden';
                    var COMENTARY = x.COMENTARIO;
                    var ESTADO2 = '';
                    var SEMAFORO = '<i   class="fas text-success fa-circle"></i>';

                    if(ESTADO == ESTADO_CREADO ){ TotalNuevos++ }
                    if(ESTADO_ESCALADO.indexOf(ESTADO) >= 0){ TotalEscalados++}
                    if(ESTADO == ESTADO_RESOLUCION){TotalResolucion++ }
                    if(ESTADO == ESTADO_FINALIZADO){  DISABLED = 'disabled' , SEMAFORO = '<i  class="fas text-danger fa-circle"></i>'}
                    if(x.COMENTARIO.length >= 30){ BTNDISABLE = '' , COMENTARY =''}
                
                    filas += `
                    <tr>

                        <td class="pt-3 ">${SEMAFORO}</td>
                        <td class="pt-3">${x.COD_TICKET}</td>
                        <td class="pt-3" >${x.SOPORTE}</td>
                        <td class="pt-3" >${x.FECHA_SOLICITUD}</td>
                        <td class="pt-3">${x.HORA_SOLICITUD}</td>
                        <td class="pt-3">${x.NIVEL_URGENCIA}</td>
                        <td class="pt-3">${x.TIPO_PROBLEMA}</td>
                        <td class="pt-3">${COMENTARY} <button ${BTNDISABLE} type="button" class="btn btn-default btn-sm p-0" data-toggle="modal" data-target="#Com${x.COD_TICKET}">
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
        
                        <td class="pt-3" > <a href="" data-toggle="modal"  data-target="#ModalFoto${x.COD_TICKET}" > <img height="20px" src="http://localhost:8000/static/core/img/galeria.png" " alt=""> </a>
                        
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
                        <td class="pt-3"> <a href="" onclick="AbrirMensajeriaRELOAD2('${x.COD_TICKET}')" data-toggle="modal" data-target="#ModalMsj${x.COD_TICKET}" > <img  height="20px"  src="http://localhost:8000/static/core/img/charlar.png"  alt=""> </a>
                        
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
                                <h6>Ticket  numero <span class="text-danger">${x.COD_TICKET}</span>  de cliente <span class="text-success" > ${x.SOPORTE}</span><h6>
                                <h6 >Asunto: <span class="text-success">${x.DESCRIPCION}</span><h6>
                                <h6 >Descripción: <span class="text-success">${x.COMENTARIO}</span><h6>
                                <h6 >Estado: <span class="text-warning">Escalado a ${localStorage['ROL_Y']}</span><h6>
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
                                        
                                
                                            <div id="m${x.COD_TICKET}"  class="modal fade bd-example-modal-sm${x.COD_TICKET}" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-centered" role="document">
                                            <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" >Finalizar Ticket</h5>
                                                <button type="button" class="btn " onclick="CerrarModal('${x.COD_TICKET}')" >
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                            <input type="number" id="HorasConsumidas${x.COD_TICKET}"" class="form-control" required name="price" min="0" value="0" step=".1">
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" onclick="Finalizar('${x.COD_TICKET}')" class="btn btn-primary">Listo</button>
                                            </div>
                                            </div>
                                        </div>
                                            </div>
                                            <button ${DISABLED} type="button" onclick="EnviarMensaje('${x.COD_TICKET}')" class="btn btn-primary shadow font-weight-bold w-25 mt-3 " >ENVIAR</button>
                                        </div>
                                
                                    </div>
                                
                            
                            </div>

                    
                            </div>
                        </div>
                        </div>
                        
                        </td>
                        <td > 
                                
                            <button  data-toggle="modal" data-target="#RsS${x.COD_TICKET}" type="button"   class="btn p-0 text-center" ><i class="fa text-primary fa-paper-plane" aria-hidden="true"></i> </button>


                            <div class="modal fade" id="RsS${x.COD_TICKET}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLongTitle">Enviar resolución</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                
                                    <form onsubmit="EnviarRCI(event,'${x.COD_TICKET}','${ROL_Y}')" >
                                    <div class="modal-body">
                                
                                            <div class="col-12">
                                                <textarea  id="mensajeST${x.COD_TICKET}"  class="w-100 form-control" cols="3" rows="3" required></textarea>
                                                <br>
                                                <div class="text-left">
                                                <label for="file">Seleccione adjunto</span></label>
                                                <br>
                                                    <input type="file" class="form-control-file"  id="files2${x.COD_TICKET}" name="files" size="1" multiple  >
                                                    </div>
                                                <input type="number" id="HorasS${x.COD_TICKET}"" class="form-control mt-3" required name="price" min="0" value="0" step=".1" required>
                                            </div>
                                        </div>
                                            <div class="modal-footer">
                                            
                                                <button type="submit"  class="btn btn-primary">Enviar</button>
                                            </div>
                                            </div>
                                    </form>
                                </div>
                            </div>
                                
                            
                        </td>
                    </tr>`;

                    $(`#estado${i}`).val(`${x.COD_TICKET}`);
                 
                  }
                    
                });
                
                tabla.append(filas);

                
                
                $('#TN').html(TotalNuevos);
                $('#TRV').html(TotalRevision);
                $('#TE').html(TotalEscalados);
                $('#TRS').html(TotalResolucion);

                
 
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
}


const EnviarRCI = (event,x,y) => {

    event.preventDefault();

    var RS =  $(`#mensajeST${x}`).val();
    var H = $(`#HorasS${x}`).val();

    if(parseInt(H) != 0 && RS != ''){

        var d = new Date();
        var Hora = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
         var Fecha = d.getUTCFullYear() +"-"+ d.getMonth() + 1 +"-"+ d.getDate().toString();
        var ADJUNTO = '0';

        if ($(`#files2${x}`).get(0).files.length != 0) { 

            var d = new Date();
            var DATE = d.getUTCFullYear() +""+ d.getMonth() +""+ d.getUTCDate()  +""+ d.getHours() +""+ d.getMinutes() +""+ d.getSeconds();

            var input = document.getElementById(`files2${x}`);
            var files = input.files;
            var formData = new FormData();

            for (var i = 0; i != files.length; i++) {
                formData.append("file", files[i]);
            }

            ADJUNTO = DATE + document.getElementById(`files2${x}`).files[0].name;

            $.ajax({
                url: `http://localhost:8000/api/ticket/ADJUNTO/${ADJUNTO}`,
                data: formData,
                type:"POST",
                processData: false,
                contentType: false,
            });
        }

        $.ajax({
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/ticket/resolucion/envio/soporte/area/${x}/${RS}/${H}/${localStorage['ROL_Y']}/${Fecha}/${Hora}/${ADJUNTO}`,
            type: "POST",
            success: function (rs){
                const data = [{
                    CODIGO_TICKET : parseInt(x),
                    CODIGO_USUARIO :  parseInt(23), //23 es el usuario mensaje
                    FECHA_MENSAJE : Fecha ,
                    HORA_MENSAJE : Hora,
                    MENSAJE : `Se ha registrado una resolución del area de ${localStorage['ROL_Y']} `,
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
                            text:'Resolución enviada con exito',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setInterval('location.reload()',1500);
                    },
                    error: function (err){
                        Swal.fire({
                            icon: 'error',
                            text:'Error con el servidol anviar resolucion',
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
                    text:'Error con el servidor al enviar rs',
                    showConfirmButton: false,
                    timer: 1200
                });
            }
        });
    } else{
        Swal.fire({
            icon: 'warning',
            text:'Asegurece de ingresar una hora mayor a 0 y una resolucion',
            showConfirmButton: false,
            timer: 1500
        });
    }
}

const CerrarModal = (COD) => {
    $(`#m${COD}`).modal('toggle');
}

const Finalizar = (COD_TICKET) => {
    if($(`#HorasConsumidas${COD_TICKET}`)){
        $.ajax({
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/ticket/${COD_TICKET}/6/1/1`,
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
                    MENSAJE : `Estado  cambiado a CERRADO `,
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
                            text:'TICKET CERRADO',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setInterval('location.reload()',1500);
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
}


const DescontarHoras = (ID_CONTRATO, HORAS , COD_TICKET) => {
    $.ajax({
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    url: `http://localhost:8000/api/contrato/descontar/horas/${ID_CONTRATO}/${HORAS}`,
    type: "PUT",
    async:false,
    success:function () {
        FinalizarTicketCrearPDF(COD_TICKET);
        }
    });
 
}

const FinalizarTicketCrearPDF = (COD_TICKET) => {
    var d = new Date();
    var DATE = "TICKET_" + COD_TICKET + d.getUTCFullYear() +""+ d.getMonth() +""+ d.getUTCDate()  +""+ d.getHours() +""+ d.getMinutes() +""+ d.getSeconds();
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/crear/pdf/finalizado/${COD_TICKET}/${DATE}`,
        type: "POST",
        async:false,
        success:function (rs) {
            Swal.fire({
                icon: 'success',
                text:'Ticket Finalizado',
                showConfirmButton: false,
                timer: 1500
            });
            setInterval('location.reload()',1500);
        }
    });
}

const FinalizarEstado = (COD_TICKET,ESTADO,ID_CONTRATO,ESTADO_TEXTO) => {
    Swal.fire({
        title: 'Cantidad de horas utilizadas.',
        html:`<br>
        <input type="number" id="HT${COD_TICKET}" class="form-control" required name="price" min="0" value="0" step=".1">`
            
    }).then((result) => {
        var HORAS = $(`#HT${COD_TICKET}`).val();
        if(parseInt(HORAS) != 0 ){

            if (result.isConfirmed) {

                Swal.fire('Porfavor Espere')
                Swal.showLoading();

                $.ajax({
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    url: `http://localhost:8000/api/ticket/cerrar/ticket/sap/${COD_TICKET}/${HORAS}`,
                    type: "PUT",
                    success: function (){

                        $.ajax({
                            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                            url: `http://localhost:8000/api/ticket/${COD_TICKET}/${ESTADO}/1/1`,
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
                                    MENSAJE : `Estado  cambiado a ${ESTADO_TEXTO} `,
                                    ADJUNTO : '0'
                                }]
                                $.ajax({
                                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                    url: `http://localhost:8000/api/mensajes`,
                                    type: "POST",
                                    dataType: 'json',
                                    data : JSON.stringify(data),
                                    success: function (){
                                      
                                    
                                        DescontarHoras(ID_CONTRATO,HORAS,COD_TICKET);
                                    },
                                    error: function (err){
                                        Swal.fire({
                                            icon: 'error',
                                            text:'Error con el servidor al guardar mensake',
                                            showConfirmButton: false,
                                            timer: 1200
                                        });
                                    }
                                });
                            },
                            error: function (err){
                             
                                Swal.fire({
                                    icon: 'error',
                                    text:'Error con el servidor al guardar estado',
                                    showConfirmButton: false,
                                    timer: 1200
                                });
                            }
                        });
                       
                    },
                    error: function (err){
                     
                        Swal.fire({
                            icon: 'error',
                            text:'Error con el servidor al guardar estado',
                            showConfirmButton: false,
                            timer: 1200
                        });
                    }
                });

                
            }
        } else{
            Swal.fire({
                icon: 'warning',
                text:'Seleccione horas validas',
                showConfirmButton: false,
                timer: 1200
            });
        }
    })
        
}

const EnviarResolucion = (COD_TICKET,ESTADO_TEXTO,ESTADO,correo) => {
 
    Swal.fire({
           title: 'Ingrese la resolución del ticket',
           html:
           `<textarea id="CMT${COD_TICKET}" class="form-control mt-2"  rows="4" requerid></textarea>
           <br>
           <div class="text-left">
           <label for="file">Seleccione adjunto</span></label>
           <br>
            <input type="file" class="form-control-file"  id="files${COD_TICKET}" name="files" size="1" multiple  required>
            </div>
           <br>
           <input type="number" id="HH${COD_TICKET}" class="form-control" required name="price" min="0" value="0" step=".1">`
       
         }).then((result) => {
        
           if (result.isConfirmed) {
               var d = new Date();
               var Hora = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
               var Fecha = d.getUTCFullYear() +"-"+ d.getMonth() + 1 +"-"+ d.getDate().toString();
               var coment = $(`#CMT${COD_TICKET}`).val();
               var HorasC = $(`#HH${COD_TICKET}`).val();

               var ADJUNTO = '0';

               if ($(`#files${COD_TICKET}`).get(0).files.length != 0) { 

                    var d = new Date();
                    var DATE = d.getUTCFullYear() +""+ d.getMonth() +""+ d.getUTCDate()  +""+ d.getHours() +""+ d.getMinutes() +""+ d.getSeconds();

                    var input = document.getElementById(`files${COD_TICKET}`);
                    var files = input.files;
                    var formData = new FormData();
    
                    for (var i = 0; i != files.length; i++) {
                        formData.append("file", files[i]);
                    }

                    ADJUNTO = DATE + document.getElementById(`files${COD_TICKET}`).files[0].name;

                    $.ajax({
                        url: `http://localhost:8000/api/ticket/ADJUNTO/${ADJUNTO}`,
                        data: formData,
                        type:"POST",
                        processData: false,
                        contentType: false,
                    });
                }
        
               $.ajax({
                   headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                   url: `http://localhost:8000/api/ticket/resolucion/envio/cliente/N/${COD_TICKET}/${coment}/${HorasC}/${Fecha}/${Hora}/${ADJUNTO}`,
                   type: "POST",
                   async:false,
                   success: function (){
                        Swal.fire('Porfavor Espere')
                        Swal.showLoading();
                       var FechaX = d.getUTCFullYear() +"-"+ d.getMonth() + 1 +"-"+ d.getDate().toString();
                       const data = [{
                           CODIGO_TICKET : parseInt(COD_TICKET),
                           CODIGO_USUARIO :  parseInt(23),
                           FECHA_MENSAJE : FechaX ,
                           HORA_MENSAJE : Hora,
                           MENSAJE : `Estado  cambiado a ${ESTADO_TEXTO} `,
                           ADJUNTO : '0'
                       }]
                       $.ajax({
                           headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                           url: `http://localhost:8000/api/mensajes`,
                           type: "POST",
                           dataType: 'json',
                           data : JSON.stringify(data),
                           success: function (){
                               $.ajax({
                                   headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                   url: `http://localhost:8000/api/ticket/${COD_TICKET}/${ESTADO}/1/1`,
                                   type: "PUT",
                                   success: function (){
                                    if(correo == 1){
                                        $.ajax({
                                            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                            url: `http://localhost:8000/api/ticket/enviar/correo/asignacion/${xtt}/${COD_TICKET}`,
                                            type: "POST",
                                            success: function (){
                                                Swal.fire({
                                                    icon: 'success',
                                                    text:'Estado cambiando',
                                                    showConfirmButton: false,
                                                    timer: 1200
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
                                        })
                                    } else {
                                        Swal.fire({
                                            icon: 'success',
                                            text:'Estado cambiando',
                                            showConfirmButton: false,
                                            timer: 1200
                                        });
                                        setInterval('location.reload()',1500);
                                    }
                                   },
                                   error: function (err){
                                       console.log(err);
                                       Swal.fire({
                                           icon: 'error',
                                           text:'Error con el servidor al cambiar estado ticket.',
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
                                   text:'Error con el servidor al guardar mensaje',
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
                        text:'Error con el servidor con enviar resolución',
                        showConfirmButton: false,
                        timer: 1200
                    });
                }
            });
        }
    });
}

const TotalRes = (COD_TICKET) => {
    rsx = 0;
    $.ajax({                
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/resolucion/listar/${COD_TICKET}`,
        type: "GET",
        dataType: 'json',
        async:false,
        success: function (RS){
            rsx = RS.length;
        }
    });
    return rsx;
}

const EnviarResolucionSap = (COD_TICKET,ESTADO_TEXTO,ESTADO,RS,ID_CONTRATO) => {
    Swal.fire('Porfavor Espere')
    Swal.showLoading();
    $.ajax({                
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/enviar/resolucion/sap/${COD_TICKET}/${RS}`,
        type: "POST",
        async:false,
        success: function (RS){
            FinalizarEstado(COD_TICKET,ESTADO,ID_CONTRATO,ESTADO_TEXTO);
        }
    });
}

const ConsultarQueResolucionEnviar = (COD_TICKET,ESTADO_TEXTO,ESTADO,ID_CONTRATO,correo) => {
    Swal.fire({
        title: '<strong>Seleccione resolución enviada a <u> SAP</u></strong>',
        html:`<div class="w-100 pt-2" id="crs${COD_TICKET}">  <div>`,
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton:false,
        width: '650px'
    })
    $(`#crs${COD_TICKET} div`).remove();
    $.ajax({                  
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/resolucion/listar/${COD_TICKET}`,
        type: "GET",
        dataType: 'json',
        success: function (RS){
            var div = $(`#crs${COD_TICKET}`);
            var cont = '' ;
            if(RS.length == 0){
                cont = 'sin contenido'
            } else {
                $.each(RS, function (x,i) {
                    x = x+1;
                    cont += `
                    <div class="alert alert-success w-100 text-left rounded border mt-1" role="alert">
                    <span>Mensaje resolución (${x}) ${i.FECHA}-${i.HORAS}</span>
                        <textarea disabled class="bg-white form-control mt-3" rows="4">${i.RS}</textarea>
                        <hr class="w-100">
                        <h6>Horas consumidas : <span class="font-weight-bold text-danger" >${i.H}</span> </h6>
                        <button type="button" class="btn btn-primary w-100 border" onclick="EnviarResolucionSap('${COD_TICKET}','${ESTADO_TEXTO}','${ESTADO}','${i.RS}','${ID_CONTRATO}');" >Seleccionar</button>
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

const Escalar = (COD_TICKET,ESTADO,ESTADO_TEXTO,correo) => {
   
    Swal.fire({

        title: 'Ingrese la resolución del ticket',
        html:`<select class="form-control mt-3" id="Soporte${ESTADO}">
        <option value=" "  hidden>Seleccione soporte</option>
        </select>`
    
    }).then((result) => {

        

        if (result.isConfirmed) {

            var xtt = $(`#Soporte${ESTADO}`).val();
     
            if(parseInt(xtt) != 0 ){

                Swal.fire('Porfavor Espere')
                 Swal.showLoading();

                var d = new Date();
                var Hora = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
                var Fecha = d.getUTCFullYear() +"-"+ d.getMonth() + 1 +"-"+ d.getDate().toString();
                
                const data = [{
                    CODIGO_TICKET : parseInt(COD_TICKET),
                    CODIGO_USUARIO :  parseInt(23),
                    FECHA_MENSAJE : Fecha ,
                    HORA_MENSAJE : Hora,
                    MENSAJE : `Estado  cambiado a ${ESTADO_TEXTO} `,
                    ADJUNTO : '0'
                }]
             

                $.ajax({
            
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    url: `http://localhost:8000/api/mensajes`,
                    type: "POST",
                    dataType: 'json',
                    data : JSON.stringify(data),
                
                    success: function (){
                        $.ajax({
                            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                            url: `http://localhost:8000/api/ticket/${COD_TICKET}/${ESTADO}/1/1`,
                            type: "PUT",
                            success: function (){
                                $.ajax({
                                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                    url: `http://localhost:8000/api/usuario/ASIGNAR_ESCALADO/UPDATE/TICKET/${xtt}/${COD_TICKET}`,
                                    type: "PUT",
                                    success: function (){

                                        if(correo == 1){

                                            $.ajax({
                                                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                                url: `http://localhost:8000/api/ticket/enviar/correo/asignacion/${xtt}/${COD_TICKET}`,
                                                type: "POST",
                                                success: function (){
                                                    Swal.fire({
                                                        icon: 'success',
                                                        text:'Estado cambiando',
                                                        showConfirmButton: false,
                                                        timer: 1200
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
                                            })

                                        } else {
                                            Swal.fire({
                                                icon: 'success',
                                                text:'Estado cambiando',
                                                showConfirmButton: false,
                                                timer: 1200
                                            });
                                            setInterval('location.reload()',1500);
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

            }  else{
                Swal.fire({
                    icon: 'warning',
                    text:'Sin usuario para este escalado.',
                    showConfirmButton: false,
                    timer: 1200
                });
            }

        }
    });

    $(`#Soporte${ESTADO} option`).remove();

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/usuario/LISTAR_USUARIO_ASIGNACION/B/${ESTADO}`,
        type: "GET",
        dataType: 'json',
        success: function (res){
            var sl = $(`#Soporte${ESTADO}`)
            if(res.length == 0){
                sl.append(`<option  selected value="0" >SIN SOPORTE PARA ESTA AREA</option>`);
            }
           $.each(res , function(x,v){
             sl.append(`<option value="${v.COD_CLIENTE}">${v.NOMBRE_CLIENTE}</option>`);
           });
        },
        error: function (err){
            console.log(err);
            Swal.fire({
                icon: 'error',
                text:'Error con el servidorxxx',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });
}


const SinOperacion = (COD_TICKET,ESTADO,ESTADO_TEXTO,correo) => {

    Swal.fire({
               title: '¿Esta seguro?',
               text: "!Estas seguro que deseas cambiar el estado ?",
               type: 'warning',
               showCancelButton: true,
               confirmButtonColor: '#3085d6',
               cancelButtonColor: '#d33',
               confirmButtonText: 'Si, deseo cambiar.'
           }).then((result) => {
               if (result.value) {
                    Swal.fire('Porfavor Espere')
                    Swal.showLoading();
                   $.ajax({
                       headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                       url: `http://localhost:8000/api/ticket/${COD_TICKET}/${ESTADO}/1/1`,
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
                               MENSAJE : `Estado cambiado a ${ESTADO_TEXTO} `,
                               ADJUNTO : '0'
                           }]

                           $.ajax({
                           
                            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                            url: `http://localhost:8000/api/mensajes`,
                            type: "POST",
                            dataType: 'json',
                            data : JSON.stringify(data),
    
                            success: function (){
                                if(correo == 1){
                                    $.ajax({
                                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                        url: `http://localhost:8000/api/ticket/enviar/correo/usuario/estado/${COD_TICKET}/${ESTADO_TEXTO}`,
                                        type: "POST",
                                        success: function (){
                                            Swal.fire({
                                                icon: 'success',
                                                text:'Estado cambiando',
                                                showConfirmButton: false,
                                                timer: 1200
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
                                    })

                                } else {
                                    Swal.fire({
                                        icon: 'success',
                                        text:'Estado cambiando',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                setInterval('location.reload()',1500);
                                }
                                 
                        },
                        error: function (err){
                                   
                            Swal.fire({
                                    icon: 'error',
                                    text:'Error con el servidor al guardar mensaje',
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
                        text:'Error con el servidor al guardar resolución',
                        showConfirmButton: false,
                        timer: 1200
                    });
                }
            });
        }
    });

}

const CambiarESTADO = (COD_TICKET,ID_CONTRATO) => {
    const ESTADO = $(`#estado${COD_TICKET}`).val();
    const ESTADO_TEXTO = $(`#estado${COD_TICKET} option:selected`).text();
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/estado`,
        type: "GET",
        dataType:'json',
        async:false,
        success: function (rs){
            $.each(rs , function(i,v){
                if(parseInt(v.COD_OPERACION) == 1){
                    if(v.CODIGO_SAP == ESTADO){
                        var rt = TotalRes(COD_TICKET);
                        if(rt == 0){
                            alert("Debe crear resolución");
                        } else{
                    
                            ConsultarQueResolucionEnviar(COD_TICKET,ESTADO_TEXTO,ESTADO,ID_CONTRATO);
                        } 
                    }
                }
                if(parseInt(v.COD_OPERACION) == 3){
                    if(v.CODIGO_SAP == ESTADO){
                        var correo = 0;
                        if(v.ENVIAR_CORREO == 1){correo=1}
                       EnviarResolucion(COD_TICKET,ESTADO_TEXTO,ESTADO,correo);
                    }
                }
                if(parseInt(v.ES_ESCALADO) == 1){
                    if(v.CODIGO_SAP == ESTADO){
                        var correo = 0;
                        if(v.ENVIAR_CORREO == 1){correo=1}
                        Escalar(COD_TICKET,ESTADO,ESTADO_TEXTO,correo);
                        
                    }
                }
                if(parseInt(v.COD_OPERACION) == 4){
                   
                    if(v.CODIGO_SAP == ESTADO && v.ES_ESCALADO == 0  ){
                        var correo = 0;
                        if(v.ENVIAR_CORREO == 1){correo=1}
                       SinOperacion(COD_TICKET,ESTADO,ESTADO_TEXTO,correo);
                        
                    }
                }
            });
        }
    });

}

const AbrirMensajeria = (COD) => {

    white = COD;
 
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/mensajes/${COD}`,
        type: "GET",
        dataType: 'json',
        success: function (rs){
            var div = $(`#contenedor${COD}`);
            var contenedor = ``;
            $.each(rs, function (i, x) {

                if(!$(`#DIV${i}${COD}`).length){

                    if(x.CODIGO_USUARIO == GcodigoUsuario ){

                        if(x.ADJUNTO == '0'){
                            contenedor +=`<div id="DIV${i}${COD}" class="col-lg-6 col-12  ">    
                                <div class="p-2" ></div>
                            </div>

                            <div class="col-lg-6 col-12 " >

                                <div class="p-2">
                                    <div class="p-2   bg-primary text-white border row rounded " >
                                        <div class="col-8 text-left"  ><span>${x.COMENTARIO}</span> </div>
                                        <div class="col-4 text-right" ><span>${x.HORA_MENSAJE} (YO) </div>
                                    </div>
                                </div>

                            </div>`;
                        } else {

                            contenedor += 
                            `<div id="DIV${i}${COD}" class="col-lg-6 col-12 "></div>
                            <div class="col-lg-6 col-12 " >
                                <div class="p-2">
                                    <div class="p-2   bg-primary text-white border  row rounded " >
                                        <div class="col-8 text-left"  ><span>${x.COMENTARIO}</span> </div>
                                        <div class="col-4 text-right" ><span>${x.HORA_MENSAJE} (YO)</div>
                                        
                                        <div class="text-white rounded  "> <a class="text-left btn btn-light  btn-sm rounded  mt-2  "  href="http://localhost:8000/media/${x.ADJUNTO}"   download>  Descargar archivo  </a> </div>
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
                                        <div class="p-2   bg-light  text-dark border rounded  row " >
                                            <div class="col-8 text-left"  ><span>${x.COMENTARIO}</span> </div>
                                            <div class="col-4 text-right" ><span>${x.HORA_MENSAJE} (${x.USUARIO}) </div>
                                        </div>
                                    </div>

                                </div>
                                <div id="DIV${i}${COD}" class="col-lg-6 col-12  ">    
                                    <div class="p-2">  
                                    </div>
                                </div>`;
                            } else{
                                contenedor +=`
                                <div class="col-lg-6 col-12 " >
                                    <div class="p-2">
                                    <div class="p-2     text-dark border rounded row  ">
                                            <div class="col-8 text-left"  ><span>${x.COMENTARIO}</span> </div>
                                            <div class="col-4 text-right" ><span>${x.HORA_MENSAJE} (${x.USUARIO})</div>
                    
                                            <div class="text-white rounded  bg-white"> <a class="text-left btn btn-success border mt-2  btn-sm  rounded " href="http://localhost:8000/media/${x.ADJUNTO}"   download>  Descargar archivo  </a> </div>
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

const Visto = (COD) => {

    var iddelawea = $(`#estado${COD}`).val();
    var ESTADO_ESCALADO = []
     
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/estado`,
        type: "GET",
        dataType:'json',
        async:false,
        success: function (rs){
            $.each(rs , function(i,v){
            if(parseInt(v.ES_ESCALADO) == 1){
              ESTADO_ESCALADO.push(v.CODIGO_SAP);
            }
        });
        }
    });

    if(ESTADO_ESCALADO.indexOf(iddelawea) >= 0){
  
    } else {
       
        $.ajax({
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/mensajes/${GcodigoUsuario}/${COD}`,
            type: "PUT",
            dataType: 'json'
        });
    }
   
}

const EnviarMensaje = (COD) => {  
    var msj = $(`#mensaje${COD}`).val()
    if(msj != ''){

        if($(`#FOTO${COD}`).val() == ''){
            mensajeSend(COD);     
        } else{

            GuardarFotoMensaje(COD);
        }
    }
}

const mensajeSend = (COD) => {

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
           
           AbrirMensajeriaRELOAD2(COD);
          
         
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

const GuardarFotoMensaje = (COD) => {
  
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
                  
                 
                  
                   $(`#FOTO${COD}`).val('');
                   AbrirMensajeriaRELOAD2(COD);
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


const AbrirMensajeriaRELOAD2 = (COD) => {
    white = COD;
    Visto(COD);
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
                           
                            <div id="DIV${i}${COD}" class="col-lg-12 col-12 pt-2 ">    
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
                                contenedor +=`
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
    setTimeout(`scrolli(${COD})`,200);
}
const scrolli = (COD) => {
    $(`#SCROLL${COD}`).scrollTop($(`#SCROLL${COD}`)[0].scrollHeight);
    $(`#SCROLL${COD}`).stop().animate({ scrollTop: $(`#SCROLL${COD}`)[0].scrollHeight}, 1000);
}