$( document ).ready(function() {
  ListarUsuario();
  
});

const ListarClienteCracion = (COD) => {

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

const ListarUsuario = () => {

    $('#ListarUsuarios > tr > td').remove()
    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/usuario`,
        type: "GET",
        dataType: 'json',
        success: function (rs){

            var tabla = $('#ListarUsuarios');
            var filas = '';
 

            $.each(rs, function( i, v ) {

                var ROL = '';
                var ESTADO_TEXTO = '';
                if(v.COD_ROL == '1'){ROL = 'ADMINISTRADOR'}
                if(v.COD_ROL == '2'){ROL = 'SOPORTE'}
                if(v.COD_ROL == '3'){ROL = 'CLIENTE'}
                if(v.COD_ROL == '4'){ROL = 'ÁREA DESARROLLO'}
                if(v.COD_ROL == '5'){ROL = 'ÁREA SOPORTE'}
                if(v.COD_ROL == '6'){ROL = 'ÁREA CONSULTORIA'}
                if(v.COD_ROL == '7'){ROL = 'ÁREA PARTNET'}
                var ESTADO = '';
                if(v.ESACTIVO == '1'){
                    ESTADO = '<i class="fas text-success fa-check-circle"></i>';
                    ESTADO_TEXTO = 'DESACTIVAR'
                }
                if(v.ESACTIVO == '0'){
                    ESTADO = '<i class="fas text-danger fa-minus-circle"></i>';
                    ESTADO_TEXTO = 'ACTIVAR';
                }

                filas += `
                <tr class="text-center">
                    <td>${ESTADO}</td>
                    <td>${v.NOMBRE_CLIENTE}</td>
                    <td>${v.CORREO}</td>
                    <td>${v.telefono}</td>
                    <td>${ROL}</td>
                    <td><a href="#" onclick="ListarClienteCracion('${v.COD_USUARIO}')" data-toggle="modal" data-target=".Modal${v.COD_USUARIO}"> <i class="fas fa-user-edit"></i></a>
                        <div class="modal fade Modal${v.COD_USUARIO}" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                         
                             <div class="modal-dialog card shadow  modal-lg w-100" >

                                <div class="modal-content w-100 " >

                                <div class="col-xl-12 col-lg-12 w-100">

                                <div class=" mb-4">
                              
                                  <div class="bg-white card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 class="m-0 font-weight-bold text-primary">MODIFICAR USUARIO</h6>
                                    <div class="dropdown no-arrow">
                                     
                                      
                                    </div>
                                  </div>
                             
                                  <div class="card-body text-left">
                                 
                    
                                        <div class="row ">
                
                                            <div class="col-12  mt-3">
                
                                                <h5>CREACION DE USUARIO PARA WEB DE SOPORTE</h5>
                                                <span>Campos obligatorios <span class="text-danger mt-2">*</span> </span>
                                                <hr>
                
                                            </div>
                
                                            <div class="col-6 mt-3">

                                            <label for="">Nombre de cliente <span class="text-danger"> *</span> </label>
                                            <select  id="NOMBRE_CLIENTE${v.COD_USUARIO}" class=" form-control form-control-lg "
                                                required>
                                                <option value="${v.COD_CLIENTE}" hidden>${v.NOMBRE_CLIENTE}</option>
                                                
                                            </select>
                    
                                        </div>
                    
                                        <div class="col-6 mt-3">
                                            <label for="">Persona contacto <span class="text-danger"> *</span> </label>
                                            <select  id="PERSONA_CONTACTO${v.COD_USUARIO}" class=" form-control form-control-lg "
                                                required>
                                                <option value="${v.COD_CONTACTO}" hidden>${v.NOMBRE_CONTACTO}</option>
                                               
                                            </select>
                    
                                        </div>
                
                                            <div class="col-6 mt-3">
                
                                                <input value="${v.CORREO}" ¿ id="correo${v.COD_USUARIO}" class=" form-control form-control-lg"
                                                    placeholder="Ingrese correo" name="correo" type="email" required>
                
                                            </div>
                
                                            <div class="col-6 mt-3">
                
                                                <input value="${v.telefono}"  id="telefono${v.COD_USUARIO}" class=" form-control form-control-lg"
                                                    placeholder="Ingrese telefono" name="telefono" type="number" required>
                
                                            </div>
                
                                            <div class="col-6 mt-3">
                
                                                <input value="${v.CONTRASEÑA}"  id="passwd${v.COD_USUARIO}" class=" form-control form-control-lg"
                                                    name="passwd" type="password" required>
                
                                            </div>
                
                                            <div class="col-6 mt-3">
                
                                                <select  id="rol${v.COD_USUARIO}" class=" form-control form-control-lg"
                                                    placeholder="Ingrese rol" name="persona_contacto"" required>
                                                    <option value="${v.COD_ROL}" hidden>${ROL}</option>
                                                    <option value="1">Administrador</option>
                                                    <option value="2">Soporte</option>
                                                    <option value="3">Cliente</option>
                                                </select>
                
                                            </div>

                            
                
                                            <div class="col-12 mt-3">
                                                <hr>
                
                                            </div>
                
                
                
                                            <div class="col-12 text-right mt-1">
                
                                                <button onclick="ModificarFormulario('${v.COD_USUARIO}')" type="button" class="btn btn-primary btn-lg font-weight-bold" >MODIFICAR</button>
                
                                            </div>
                
                                        </div>

                                  </div>
                                </div>
                              </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td> <button onclick="CambiarEstado('${v.COD_USUARIO}','${v.ESACTIVO}')" type="button" class="btn btn-outline-secondary w-100"  > ${ESTADO_TEXTO} </button> </td>
                </tr>`;
            });

            tabla.append(filas);


        },
        error: function (){
            Swal.fire({
                icon: 'Error servidor',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });

}

const CambiarEstado = (COD,E) => {
 
    if(E == '1'){ NUMERO = 0 ;}else{NUMERO = 1 ;}
   
    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/usuario/${COD}/${NUMERO}`,
        type: "PUT",
        success: function (){
            ListarUsuario();

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

const ModificarFormulario = (COD) => {
 
    var data = [{
 
        COD_USUARIO : parseInt(COD) ,
        COD_CLIENTE: $(`#NOMBRE_CLIENTE${COD}`).val() ,
        CORREO:  $(`#correo${COD}`).val()  ,
        COD_CONTACTO:  parseInt($(`#PERSONA_CONTACTO${COD}`).val() ) ,
        TELEFONO:  parseInt($(`#telefono${COD}`).val() ) ,
        ESACTIVO:  1,
        COD_ROL:  parseInt($(`#rol${COD}`).val() ) ,
        CONTRASEÑA:  $(`#passwd${COD}`).val() ,
        NOMBRE_CLIENTE: $(`#NOMBRE_CLIENTE${COD} option:selected`).text() ,
        NOMBRE_CONTACTO: $(`#PERSONA_CONTACTO${COD} option:selected`).text() 
    }];

    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/usuario`,
        type: "PUT",
        data: JSON.stringify(data),
        success: function (res){

            Swal.fire({
                icon: 'success',
                text:'Usuario Modificado',
                showConfirmButton: false,
                timer: 1200
            });

            setInterval('location.reload()',1200);

        },
        error: function (err){
         
            Swal.fire({
                icon: 'error',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });

}