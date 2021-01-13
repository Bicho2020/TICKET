CODGLOBAL = 0;

$( document ).ready(function() {
    ListarContratos();
});


const ListarContratos = () => {
    
    $('#ListarContratos > tr > td').remove();

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/contrato`,
        type: "GET",
        dataType: 'json',
        success: function (rs){
            var tabla = $('#ListarContratos');
            var filas = '';

            $.each(rs, function (i, x) {

                var ESTADO = x.ESTADO.trim();

                var TIPO_PERIODO = x.TIPO_PERIODO;

                if(ESTADO == 'T'){ESTADO = 'Cancelado'}
                if(ESTADO == 'A'){ESTADO = 'Autorizado'}
                if(ESTADO == 'F'){ESTADO = 'Bloqueado'}
                if(ESTADO == 'D'){ESTADO = 'Borrado'}

                if(TIPO_PERIODO == '1'){TIPO_PERIODO = 'MENSUAL'}
                if(TIPO_PERIODO == '2'){TIPO_PERIODO = 'ANUAL'}
                
                filas += 
                `<tr>
                    <td>${x.NUMERO_CONTRATO}</td>
                    <td>${x.NOMBRE_CONTRATO}</td>
                    <td>${x.NOMBRE_CLIENTE}</td>
                    <td>${x.PERSONA_CONTACTO}</td>
                    <td>${x.FECHA_INICIO_CONTRATO}</td>
                    <td>${x.FECHA_TERMINO_CONTRATO}</td>
                    <td>${x.HORAS}</td>
                    <td>${ESTADO}</td>
                    <td> <a onclick="ListarClienteM('${x.COD_CONTRATO}')" type="button"   data-toggle="modal" data-target=".d${x.COD_CONTRATO}"  > <i class="fa fa-refresh" aria-hidden="true"> </i>
                    </a>
                    <div class="modal fade d${x.COD_CONTRATO}" id="d${x.COD_CONTRATO}" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                            <div class="col-xl-12 col-lg-12">
                                <div class="">

                                    <div class=" bg-white card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 class="m-0 font-weight-bold text-primary">MODIFICAR CONTRATO</h6>
                                        <div class="dropdown no-arrow">


                                        </div>
                                    </div>

                                    <div class="card-body">

                                        <form id="RegistrarFormulario${x.COD_CLIENTE}">

                                            <div class="row text-left ">

                                                <div class="col-12 text-left  ">

                                                    <h5>MODIFICACIÓN DE CONTRATO PARA WEB DE SOPORTE</h5>
                                                    <span>Campos obligatorios <span class="text-danger mt-2">*</span> </span>
                                                    <hr>

                                                </div>

                                                <div class="col-6  ">
                                                    <label for="">Nombre de cliente <span class="text-danger">*</span> </label>
                                                    <select  id="NOMBRE_CLIENTE${x.COD_CONTRATO}" class=" form-control form-control-lg"
                                                        required>
                                                        <option value="${x.COD_CLIENTE}" hidden>${x.NOMBRE_CLIENTE}</option>
                                                      
                                                    </select>

                                                </div>

                                                <div class="col-6 ">
                                                    <label for="">Persona contrato <span class="text-danger">*</span> </label>
                                                    <select  id="PERSONA_CONTACTO${x.COD_CONTRATO}" class=" form-control form-control-lg"
                                                        required>
                                                        <option value="${x.COD_PERSONA_CONT}" hidden>${x.PERSONA_CONTACTO}</option>
                                                       
                                                    </select>

                                                </div>



                                                <div class="col-6 mt-3">
                                                    <label for="">Nombre contrato<span class="text-danger">*</span> </label>
                                                    <input value="${x.NOMBRE_CONTRATO}" id="NOMBRE_CONTRATO${x.COD_CONTRATO}" class=" form-control form-control-lg"
                                                        placeholder="Nombre contrato" type="text" required>

                                                </div>

                                                <div class="col-6 mt-3">
                                                    <label for="">Nombre de contrato sap <span class="text-danger">*</span> </label>
                                                    <input value="${x.NUMERO_CONTRATO}"  id="NUMERO_CONTRATO_SAP${x.COD_CONTRATO}" class=" form-control form-control-lg"
                                                        placeholder="Numero contrato sap" type="number" required>

                                                </div>

                                                <div class="col-6 mt-3">
                                                    <label for="">Fecha inicio contrato <span class="text-danger">*</span> </label>
                                                    <input value="${x.FECHA_INICIO_CONTRATO}" id="FECHA_INICIO_CONTRATO${x.COD_CONTRATO}" class=" form-control form-control-lg"
                                                        type="date" required>

                                                </div>

                                                <div class="col-6 mt-3">
                                                    <label for="">Fecha fin contrato <span class="text-danger">*</span> </label>
                                                    <input  value="${x.FECHA_TERMINO_CONTRATO}" id="FECHA_FIN_CONTRATO${x.COD_CONTRATO}" class=" form-control form-control-lg"
                                                        placeholder="Fin contrato" type="date" required>

                                                </div>

                                                <div class="col-6 mt-3">

                                                    <label for="">Tipo contrato <span class="text-danger"> *</span> </label>
                                                    <select  id="TIPO_CONTRATO${x.COD_CONTRATO}" class=" form-control form-control-lg "
                                                        required>
                                                        <option value="${x.TIPO_CONTRATO}" hidden>${x.TIPO_CONTRATO}</option>
                                                        <option value="Soporte" >Soporte</option>
                                                        <option value="Mejora" >Mejora</option>
                                                        <option value="PaC" >PaC</option>
                                                        <option value="PaD" >PaD</option>
                                                        <option value="Keyrem" >Keyrem</option>
                                                        
                                                    </select>

                                                </div>

                                                
                                                <div class="col-6 mt-3">

                                                    <label for="">Tipo Periodo <span class="text-danger"> *</span> </label>
                                                    <select  id="TIPO_PERIODO${x.COD_CONTRATO}" class=" form-control form-control-lg "
                                                        required>
                                                        <option value="${x.TIPO_PERIODO}" hidden>${TIPO_PERIODO}</option>
                                                        <option value="1" >Mensual</option>
                                                        <option value="2" >Anual</option>
                                                        
                                                    </select>

                                                </div>

                                                <div class="col-6 mt-3">

                                                    <label for="">Estado<span class="text-danger"> *</span> </label>
                                                    <select  id="ESTADO${x.COD_CONTRATO}" class=" form-control form-control-lg " required>
                                                        <option value="${x.ESTADO}" hidden>${ESTADO}</option>
                                                        <option value="T">Cancelado</option>
                                                        <option value="A">Autorizado</option>
                                                        <option value="F">Bloqueado</option>
                                                        <option value="D">Borrador</option>
                                                        
                                                    </select>

                                                </div>

                                                
                                                <div class="col-6 mt-3">

                                                <label for="">Horas<span class="text-danger"> *</span> </label>
                                                <input  id="HORAS${x.COD_CONTRATO}" value="${x.HORAS}" class=" form-control form-control-lg " placeholder="0" type="number" required>

                                                </div>


                                                <div class="col-6 mt-3">
                                                    <label for="">Descripción <span class="text-danger">*</span> </label>
                                                    <textarea value="${x.DESCRIPCION}" class=" form-control form-control-lg" id="DESCRIPCION${x.COD_CONTRATO}" rows="3" cols="50">${x.DESCRIPCION}</textarea>

                                                </div>

                                                <div class="col-12 mt-3">
                                                    <hr>

                                                </div>



                                                <div class="col-12 text-right mt-1">

                                                    <button type="button" onclick="Modificar('${x.COD_CONTRATO}')" class="btn btn-primary btn-lg font-weight-bold"
                                                    type="button">MODIFICAR</button>

                                                </div>

                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>

                            </div>
                        </div>
                    </div>
                    </td>
                    <td> <a type="button" onclick="EliminarContrato('${x.COD_CONTRATO}')" > <i class="far text-danger fa-trash-alt"></i> <a> </td>
             
                </tr>`;
            });
            tabla.append(filas);
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

const EliminarContrato = (COD) => {

    Swal.fire({
        title: '¿Esta seguro?',
        text: "!Estas seguro que deseas eliminar este contrato ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo eliminar.'
  
      }).then((result) => {
          
        if (result.value) {
            
            $.ajax({
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                url: `http://localhost:8000/api/contrato/${COD}`,
                type: "DELETE",
                success: function (){
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    ListarContratos();
                }
                
            });
        }
    });   

}


const ListarClienteM = (COD) => {
  
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/usuario/cliente/sap`,
        type: "GET",
        dataType:'json',
        success: function (rs){
            select = $(`#NOMBRE_CLIENTE${COD}`);
            $.each(rs , function(x,v){
                select.append(`<option value="${v.CARDCODE}">${v.CARDNAME}</option>`);
            });
      
        }
    });

    $(`#NOMBRE_CLIENTE${COD}`).change(function(){

        $.ajax({
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/usuario/cliente/sap/${this.value}`,
            type: "GET",
            dataType:'json',
            success: function (rs){
                select = $(`#PERSONA_CONTACTO${COD}`);
                $(`#PERSONA_CONTACTO${COD} option`).remove();
                $.each(rs , function(x,v){
                    select.append(`<option value="${v.COD}">${v.NOMBRE}</option>`);
                });
          
            }
        });
    });
}


const Modificar = (COD) => {
   
    const data = {
        COD_CONTRATO: COD,
        NOMBRE_CLIENTE :  $(`#NOMBRE_CLIENTE${COD}`).find(":selected").text(),
        COD_CLIENTE :  $(`#NOMBRE_CLIENTE${COD}`).val(),
        PERSONA_CONTACTO :  $(`#PERSONA_CONTACTO${COD}`).find(":selected").text(),
        COD_PERSONA_CONTACTO :  $(`#PERSONA_CONTACTO${COD}`).val(),
        NOMBRE_CONTRATO :  $(`#NOMBRE_CONTRATO${COD}`).val(),
        NUMERO_CONTRATO :  $(`#NUMERO_CONTRATO_SAP${COD}`).val(),
        FECHA_INICIO_CONTRATO :  $(`#FECHA_INICIO_CONTRATO${COD}`).val(),
        FECHA_TERMINO_CONTRATO :  $(`#FECHA_FIN_CONTRATO${COD}`).val(),
        DESCRIPCION :  $(`#DESCRIPCION${COD}`).val(),
        ESTADO :  $(`#ESTADO${COD}`).val(),
        HORAS :  $(`#HORAS${COD}`).val(),
        TIPO_CONTRATO :  $(`#TIPO_CONTRATO${COD}`).val(),
        TIPO_PERIODO :  $(`#TIPO_PERIODO${COD}`).val()
    }

    


    Swal.fire({
        title: '¿Esta seguro?',
        text: "!Estas seguro que desea modificar contrato ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo modificar.'
  
      }).then((result) => {
          
        if (result.value) {
            
            $.ajax({
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                url: `http://localhost:8000/api/contrato`,
                type: "PUT",
                data: JSON.stringify(data),
                success: function (){

            
                    Swal.fire({
                        icon: 'success',
                        title: 'Modificado',
                        showConfirmButton: false,
                        timer: 1500
                    })

                    setInterval( function(){
                        window.location.href = window.location;
                    } ,1500);
                   
                },
     
            });
        }
    });  

    

}