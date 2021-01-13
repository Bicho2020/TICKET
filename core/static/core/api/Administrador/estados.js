$(document).ready(function(){
    ListarEstadoActual();
});

const ListarEstadoActual = () => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/estado`,
        type: "GET",
        dataType:'json',
        success: function (rs){
            var tabla = $('#TablaEstadosActual');
            var filas = '';
            $.each(rs , function(i,v){
                
                var ESTADO_CORREO = v.ENVIAR_CORREO;
                var ESTADO_ESCALADO = v.ES_ESCALADO;
                var EC = '';
                var EE = '';
                if(parseInt(ESTADO_CORREO) == 1){EC = 'checked'}
                if(parseInt(ESTADO_ESCALADO) == 1 ){EE = 'checked'}

                filas += ` <tr>
                <td hidden> <input readonly type="text" value="1" disabled class="form-control">  </td>
                <td> ${v.ESTADO_NOMBRE}</td>
                <td>${v.OPERACION}</td>
                <td>${v.CODIGO_SAP}</td>
                <td> <input readonly="readonly"   onclick="return false;"  style="height: 25px; " type="checkbox" class="form-check-input" ${EC}> </td>
                <td> <input readonly="readonly"   onclick="return false;"  style="height: 25px;" type="checkbox" class="form-check-input" ${EE}>  </td>
               
            </tr>`;
            
            });
            tabla.append(filas);
        },error:function(err){
           
        }
    });
}


const ListarRolesEstados = () => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/roles`,
        type: "GET",
        dataType:'json',
        success: function (rs){
            $('#TablaEstados > tbody > tr').each(function(x) {   
                if(!$(`#opt${x}`).length){
                    var SELECT = $(this).find("td:eq(2) select");
                    var optionsg = '';
                    optionsg += `<optgroup id="opt${x}"  label="Escalados">`;
                    $.each(rs , function(x,v){
                        optionsg += `<option id="${x}${v.COD_ROL}" value="${v.COD_ROL}">${v.NOMBRE}</option>`
                    });
    
                    optionsg += '</optgroup>';
                    SELECT.append(optionsg);
                }
            });
        }
    });
}
$TABLA = $('#TablaEstados tbody');

const Change = () => {
   
    $('#TablaEstados > tbody > tr').each(function(x) {   
              
        if($(this).find("td:eq(2) select optgroup option:selected").attr('id')){
         
            $(this).find(`td:eq(5) input[type='checkbox']`).prop('checked',true);
        } else{
            $(this).find(`td:eq(5) input[type='checkbox']`).prop('checked',false);
        }
       
    });
}

$FILA = `<tr>
<td hidden> <input type="text"  class="form-control">  </td>
<td> <input  type="text"  class="form-control">  </td>
<td>
    <select onchange="Change();" class="form-control"> 
        <option hidden value="0" >SELECCIONE OPERACIÓN</option>
        <option value="1">FINALIZAR TICKET</option>
        <option value="2">ESCALAR TICKET</option> 
        <option value="3">ENVIAR RESOLICIÓN</option> 
        <option value="4">NINGUNA</option> 
    </select> 
</td>
<td> <input  type="text"  class="form-control"></td>
<td> <input style="height: 25px;" type="checkbox" class="form-check-input"> </td>
<td> <input  readonly="readonly"   onclick="return false;" style="height: 25px;" type="checkbox" class="form-check-input">  </td>
<td> <button type="button"   class="btn btn-default p-0 EliminarFila" ><i style="height: 25px;"  class="fas pt-2 text-danger fa-trash-alt"></i></button>  </td>
</tr>`;

const AgregarFilas = () => {
    $TABLA.append($FILA);
    ListarRolesEstados();
};

$TABLA.on('click', '.EliminarFila', function () {
    var nColumnas = $("#TablaEstados tr").length;    
    if(nColumnas != 2){
        $(this).parents('tr').detach();
    }
});

const Validar = () => {
    var v = 0;
    var data = [];
    $('#TablaEstados > tbody  > tr').each(function(i) {   

        var NOMBRE_ESTADO = $(this).find("td:eq(1) input[type='text']").val();
        var OPERACION_ID = $(this).find("td:eq(2) select").val();
        var CODIGO_SAP = $(this).find("td:eq(3) input[type='text']").val();
        var ENVIAR_CORREO = $(this).find("td:eq(4) input[type='checkbox']").is(':checked'); 
        var ES_ESCALABLE = $(this).find("td:eq(5) input[type='checkbox']").is(':checked'); 
        if(NOMBRE_ESTADO.length == 0 || OPERACION_ID == "0" || CODIGO_SAP.length == 0 ){
           v++;
        } else {
            $('#TablaEstados > tbody  > tr').each(function(x) {   
                if(i != x){
                
                    var NOMBRE_ESTADO_2 = $(this).find("td:eq(1) input[type='text']").val();
                    var CODIGO_SAP_2 = $(this).find("td:eq(3) input[type='text']").val();
                    if( NOMBRE_ESTADO_2 == NOMBRE_ESTADO || CODIGO_SAP_2 == CODIGO_SAP ){
                        v++;
                    }
                }
            });
            if(ENVIAR_CORREO == true){
                ENVIAR_CORREO = 1;
            } else{ENVIAR_CORREO = 0;}
            if(ES_ESCALABLE == true){
                ES_ESCALABLE = 1;
            } else{ES_ESCALABLE = 0;}
            var values = {
                NOMBRE: NOMBRE_ESTADO ,
                OPERACION:  OPERACION_ID,
                CODIGO_SAP:  CODIGO_SAP ,
                ENVIAR_CORREO: ENVIAR_CORREO,
                ES_ESCALABLE:ES_ESCALABLE
            }
            data.push(values);
        }
    });

    if(v == 0 ){
        var v2 = 0;
        $('#TablaEstados > tbody  > tr').each(function(x) {   
            var OPERACION_ID = $(this).find("td:eq(2) select").val();
            if(OPERACION_ID == "1"){
                v2++;
            } 
        });
        if(v2 != 0){
            GuardarEstados(data);
        } else{
            Swal.fire({
                icon: 'warning',
                title: `Debe haber un estado de finalización de ticket.`,
                showConfirmButton: false,
                timer: 1500
            });
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: `Porfavor ingrese todos los campos y asegurece de no repetir codigos o nombres de los estados`,
            showConfirmButton: false,
            timer: 1500
        });
    }  
}

const GuardarEstados = (data) => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/estado`,
        type: "POST",
        data:JSON.stringify(data),
        success: function (){
            Swal.fire({
                icon: 'success',
                title: `Estado Guardado Correctamente`,
                showConfirmButton: false,
                timer: 1500
            });
        },error:function(){
            Swal.fire({
                icon: 'danger',
                title: `Error al  Guardar`,
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
   
}

