$( document ).ready(function() {
    GcodigoUsuario = localStorage['CODIGO_USUARIO'];
    ListarSolicitudes();
});


const ListarSolicitudes = () => {

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

    $('#TablaSolicitudes > tr > td').remove();

    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/${GcodigoUsuario}/2/1/1`,
        type: "GET",
        dataType: 'json',
        success: function (rs){

            tabla = $('#TablaSolicitudes');
            filas = ``;

            $.each(rs, function (i, x) {

                var ESTADO = x.ESTADO;

                if(ESTADO == ESTADO_CREADO){
            
                filas += `
                <tr>

                    <td class="pt-3">${x.COD_TICKET}</td>
                    <td class="pt-3" >${x.SOPORTE}</td>
                    <td class="pt-3" >${x.FECHA_SOLICITUD}</td>
                    <td class="pt-3">${x.HORA_SOLICITUD}</td>
                    <td class="pt-3">${x.NIVEL_URGENCIA}</td>
                    <td class="pt-3">${x.TIPO_PROBLEMA}</td>
                    <td class="pt-3">${x.COMENTARIO}</td>
      
                    <td class="pt-3"> <a href="" data-toggle="modal"  data-target="#ModalFoto${x.COD_TICKET}" > <img height="20px" src="http://localhost:8000/static/core/img/galeria.png" " alt=""> </a>
                    
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
                   
                    <td class="pt-3">  <a href=""  data-toggle="modal" data-target=".x${x.COD_TICKET}" onclick="ModalSoporte(${x.COD_TICKET})" > <img style="height:20px" src="http://localhost:8000/static/core/img/mas.png" alt=""> </a> 
                    
                    <div class="modal fade x${x.COD_TICKET}" id="x${x.COD_TICKET}" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">ASIGNAR SOPORTE</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                
                                    <form onsubmit="ASIGNAR_SOPORTE(event,'${x.COD_TICKET}')" >

                                        <div class="form-group text-left">
                                       
                                            <select class="form-control form-control-lg" id="S${x.COD_TICKET}" required>
                                               <option value="" hidden>Seleccione soporte</option>
                                            </select>
                                        </div>

                                        <hr>

                                        <button id="crear${x.COD_TICKET}" type="submit" class="btn btn-primary w-100" >ASIGNAR SOPORTE</button>
                                        <button id="load${x.COD_TICKET}" disabled  class="btn btn-primary w-100 font-weight-bold" type="button" ><span  class="spinner-border  "></span></button>
                                        
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    </td>
                </tr>`;

                $(`#estado${i}`).val(`${x.COD_TICKET}`);
                  }

            });

            tabla.append(filas);

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

const ASIGNAR_SOPORTE = (event,COD_TICKET) => {

    $(`#load${COD_TICKET}`).show();
    $(`#crear${COD_TICKET}`).hide();
    
    event.preventDefault();

    COD_USUARIO = $(`#S${COD_TICKET}`).val();
    USUARIO = $(`#S${COD_TICKET} option:selected`).text();
    
    Swal.fire({
        title: '¿Esta seguro?',
        text: `¿Asignar a ${USUARIO} al ticket numero ${COD_TICKET} ?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo asignar.'
  
      }).then((result) => {
          
        if (result.value) {

           $.ajax({

               headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
               url: `http://localhost:8000/api/ticket/asignacion/${COD_USUARIO}/${COD_TICKET}`,
               type: "PUT",
               success:function(){

                $('#load').hide();
                $('#crear').show();

                $(function () {
                    $(`#x${COD_TICKET}`).modal('toggle');
                });

                Swal.fire({
                    icon: 'success',
                    text:'ASIGNACIÓN LISTA',
                    showConfirmButton: false,
                    timer: 1800
                });

                setInterval('location.reload()',1800);

                
               },error:function(){
                $('#load').hide();
                $('#crear').show();
               }
        
           });
            
        }
    });

}

const ModalSoporte = (cod)  => {

   
    $(`#load${cod}`).hide();

    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/soporte`,
        type: "GET",
        dataType: 'json',
        success:function(rs){


            $(`#S${cod} option`).remove();
            $.each(rs , function(i,x){
           
                $(`#S${cod}`).append(`<option value="${x.COD_USUARIO}">${x.USUARIO}</option>`);
            });
          
        }

    });
 
   
  
}