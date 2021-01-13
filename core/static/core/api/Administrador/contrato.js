$( document ).ready(function() {
  
  ListarCliente();
  ListarNumeroSap();
});

const ListarCliente = () => {

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/usuario/cliente/sap`,
        type: "GET",
        dataType:'json',
        success: function (rs){
            select = $(`#NOMBRE_CLIENTE`);
            $.each(rs , function(x,v){
                select.append(`<option value="${v.CARDCODE}">${v.CARDNAME}</option>`);
            });
      
        }
    });
}

const ListarNumeroSap = () => {

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/contrato/numero/sap`,
        type: "GET",
        dataType:'json',
        success: function (rs){
            select = $(`#NUMERO_CONTRATO_SAP`);
            $.each(rs , function(x,v){
                select.append(`<option value="${v.CONTRACTID}">${v.CONTRACTID}</option>`);
            });
      
        }
    });

}


const ListarDatosSAP = () => {

    if($('#NUMERO_CONTRATO_SAP').val() == '') {

        Swal.fire({
            icon: 'warning',
            text:'SELECCIONE NUMERO SAP',
            showConfirmButton: false,
            timer: 1200
        });

    }else {
    
        $.ajax({
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/contrato/sap/${$('#NUMERO_CONTRATO_SAP').val()}`,
            type: "GET",
            dataType:'json',
            success: function (rs){
                
                var NOMBRE_CLIENTE = rs[0].NOMBRE_CLIENTE
                var COD_CLIENTE = rs[0].COD_CLIENTE
                var NOMBRE_CONTACTO = rs[0].NOMBRE_CONTACTO
                var COD_PERSONA_CONTACTO = rs[0].PERSONA_CONTACTO
                var NOMBRE_CONTRATO = rs[0].NOMBRE_CONTRATO
                var FECHA_INICIO_CONTRATO = rs[0].FECHA_INICIO_CONTRATO
                var FECHA_TERMINO_CONTRATO = rs[0].FECHA_TERMINO_CONTRATO
                var ESTADO = rs[0].ESTADO
                var TIPO = rs[0].TIPO
                var TIPO_PERIODO = rs[0].TIPO_PERIODO
                var HORAS = rs[0].HORAS
            
                $('#HORAS').val(HORAS);

                $('#NOMBRE_CLIENTE').val(COD_CLIENTE);
                $(`#NOMBRE_CLIENTE option[value="${COD_CLIENTE}"]`).text(NOMBRE_CLIENTE);

        
                $(`#PERSONA_CONTACTO option`).remove();
                $('#PERSONA_CONTACTO').append(`<option value="${COD_PERSONA_CONTACTO}">${NOMBRE_CONTACTO}</option>`);
                $(`#PERSONA_CONTACTO option[value="${COD_PERSONA_CONTACTO}"]`);

        

                $('#NOMBRE_CONTRATO').val(NOMBRE_CONTRATO);
                
                $('#FECHA_INICIO_CONTRATO').val(FECHA_INICIO_CONTRATO);
                $('#FECHA_FIN_CONTRATO').val(FECHA_TERMINO_CONTRATO);
                $('#ESTADO').val(ESTADO);
                $('#TIPO_PERIODO').val(TIPO_PERIODO);
                $('#TIPO_CONTRATO').val(TIPO);

                

                


        
            }
        });
    }

}


$('#NOMBRE_CLIENTE').change(function(){

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/usuario/cliente/sap/${this.value}`,
        type: "GET",
        dataType:'json',
        success: function (rs){
            select = $(`#PERSONA_CONTACTO`);
            $(`#PERSONA_CONTACTO option`).remove();
            $.each(rs , function(x,v){
                select.append(`<option value="${v.COD}">${v.NOMBRE}</option>`);
            });
      
        }
    });
});

const RegistrarContrato = (event) => {
    event.preventDefault();
    var d = new Date();
    var Fecha = d.getUTCFullYear() +"-"+ d.getMonth() + 1 +"-"+ d.getDate().toString();
    var DATE = d.getUTCFullYear() +""+ d.getMonth() +""+ d.getUTCDate()  +""+ d.getHours() +""+ d.getMinutes() +""+ d.getSeconds();

    if( document.getElementById("files").files.length != 0 ){
        var input = document.getElementById('files');
        var files = input.files;
        var formData = new FormData();
    
        for (var i = 0; i != files.length; i++) {
            formData.append("file", files[i]);
        }
    
        var COD = DATE + document.getElementById('files').files[0].name;
    
        const data = {
    
            NOMBRE_CLIENTE :  $('#NOMBRE_CLIENTE').find(":selected").text(),
            COD_CLIENTE :  $('#NOMBRE_CLIENTE').val(),
            PERSONA_CONTACTO :  $('#PERSONA_CONTACTO').find(":selected").text(),
            COD_PERSONA_CONTACTO :  $('#PERSONA_CONTACTO').val(),
            FECHA_DOCUMENTO :  Fecha,
            NOMBRE_CONTRATO :  $('#NOMBRE_CONTRATO').val(),
            NUMERO_CONTRATO :  parseInt($('#NUMERO_CONTRATO_SAP').val()),
            FECHA_INICIO_CONTRATO :  $('#FECHA_INICIO_CONTRATO').val(),
            FECHA_TERMINO_CONTRATO :  $('#FECHA_FIN_CONTRATO').val(),
            DESCRIPCION :  $('#DESCRIPCION').val(),
            HORAS :  $('#HORAS').val(),
            HORAS_RESTANTES :  $('#HORAS').val(),
            ESTADO :  $('#ESTADO').val(),
            TIPO_PERIODO :  $('#TIPO_PERIODO').val(),
            TIPO_CONTRATO :  $('#TIPO_CONTRATO').val(),
            ADJUNTO: COD
        }
    
    
    
        $.ajax({
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/contrato`,
            type: "POST",
            data : JSON.stringify(data),
            success: function (){
    
    
                $.ajax({
                    url: `http://localhost:8000/api/contrato/adjunto/${COD}`,
                    data: formData,
                    type:"POST",
                    processData: false,
                    contentType: false,
                    success: function (res) {
                
                        Swal.fire({
                            icon: 'success',
                            text:'REGISTRADO CON EXITO',
                            showConfirmButton: false,
                            timer: 1200
                        });
                        $("#RegistrarFormulario")[0].reset();
    
                    },
                    error: function (err){
                      
                        Swal.fire({
                            icon: 'error',
                            text:'Error al guardar imagen',
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
                    showConfirmButton: false,
                    timer: 1200
                });
            }
        });
    
    } else {
      
        const data = {
    
            NOMBRE_CLIENTE :  $('#NOMBRE_CLIENTE').find(":selected").text(),
            COD_CLIENTE :  $('#NOMBRE_CLIENTE').val(),
            PERSONA_CONTACTO :  $('#PERSONA_CONTACTO').find(":selected").text(),
            COD_PERSONA_CONTACTO :  $('#PERSONA_CONTACTO').val(),
            FECHA_DOCUMENTO :  Fecha,
            NOMBRE_CONTRATO :  $('#NOMBRE_CONTRATO').val(),
            NUMERO_CONTRATO :  parseInt($('#NUMERO_CONTRATO_SAP').val()),
            FECHA_INICIO_CONTRATO :  $('#FECHA_INICIO_CONTRATO').val(),
            FECHA_TERMINO_CONTRATO :  $('#FECHA_FIN_CONTRATO').val(),
            DESCRIPCION :  $('#DESCRIPCION').val(),
            HORAS :  $('#HORAS').val(),
            HORAS_RESTANTES :  $('#HORAS').val(),
            ESTADO :  $('#ESTADO').val(),
            TIPO_PERIODO :  $('#TIPO_PERIODO').val(),
            TIPO_CONTRATO :  $('#TIPO_CONTRATO').val(),
            ADJUNTO: 'SIN ADJUNTO'
        }
    
    
    
        $.ajax({
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            url: `http://localhost:8000/api/contrato`,
            type: "POST",
            data : JSON.stringify(data),
            success: function (){
    
                Swal.fire({
                    icon: 'success',
                    text:'REGISTRADO CON EXITO',
                    showConfirmButton: false,
                    timer: 1200
                });
                $("#RegistrarFormulario")[0].reset();

               
            },
            error: function (err){
                console.log(err);
                Swal.fire({
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1200
                });
            }
        });
    }
 
    
}

