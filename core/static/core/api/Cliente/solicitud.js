$( document ).ready(function() {
    $('#load').hide();
    $('#alertHoras').hide();
    $('#informe').hide();
    $('#Noti').hide();

    var d = new Date();
    var Fecha = d.getUTCFullYear() +"-"+ d.getMonth() + 1 +"-"+ d.getDate().toString();

    $("#FECHA").val(Fecha);

   GcodigoUsuario = localStorage['CODIGO_USUARIO'];
   COD_CLIENTE = localStorage['COD_CLIENTE'];
 
   LISTARCONTRATOS();
   LISTARTIPOPROBLEMAS();

    $("#DESCRIPCION").blur(function() {
   
        var Symptom = $('#DESCRIPCION').val();
        var Desciptio = $('#COMENTARIO').val();
        TotalSugerencia(Symptom,Desciptio);
    
    });

    $("#COMENTARIO").blur(function() {
       
        var Symptom = $('#DESCRIPCION').val();
        var Desciptio = $('#COMENTARIO').val();
        TotalSugerencia(Symptom,Desciptio);
    
    });

 
});

LISTARTIPOPROBLEMAS = () => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/LISTAR/TODO/TIPO_PROBLEMA/DESDE/SAP`,
        type: "GET",
        dataType:'json',
        success: function (res){
            select = $(`#tipo_problema`);
           
            $.each(res , function (x,i){
                select.append(`<option  value="${i.ID}">${i.DESC}</option>`);
            });
      
        }
    });
}

const AbrirS = () => {

    $('#contS div').remove();
    var Symptom = $('#DESCRIPCION').val();
    var Desciptio = $('#COMENTARIO').val();
    if(Symptom == ''){
        Symptom = '><';
    }
    if(Desciptio == ''){
        Desciptio = '><';
    }

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/total/sugerencia/lista/x/${Symptom}/${Desciptio}`,
        type: "GET",
        dataType:'json',
        success: function (res){
         
            var div = $('#contS');
            var cont = '';
            console.log(res);
            $.each(res , function (x,i){
                var des = "Sin descripción"
                var asun = "Sin asunto"
                if(i.DESCRIPTIO != null)  {des = i.DESCRIPTIO}
                if(i.SYMPTOM != null) {asun = i.SYMPTOM}
                cont += `<div class="alert alert-warning border-warning " role="alert"> - Solución: ${i.RES} <br> <hr> - Asunto: ${asun}<br> <hr> - Descripción: ${des} </div>`;
            });

            div.append(cont);


           
        },error:function (err){
            console.log(err);
        }

    });

}


const TotalSugerencia = (Symptom,Desciptio) => {

    if(Symptom == ''){
        Symptom = '><';
    }
    if(Desciptio == ''){
        Desciptio = '><';
    }

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/total/sugerencia/contar/crecion/${Symptom}/${Desciptio}`,
        type: "GET",
        dataType:'json',
        success: function (res){
         
            if(res[0].RS >= '1'){

                
                $('#Noti').show();
                
            } else {
                $('#Noti').hide();
            };
           
        },error:function (err){
            console.log(err);
        }

    });

}

const VertificarHoras = (N) => {

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/contrato/horas/${N}`,
        type: "GET",
        dataType:'json',
        async: false,
        success: function (rs){
            const R = parseFloat(rs[0].RESTANTES);
            const HH = parseFloat(rs[0].HORAS);
            if(R <= 1){

                if(R == 1){
                    $('#alertHoras').html(` <i style="font-size:24px" class="fas float-left fa-exclamation-circle"></i>Le quedan (${R} horas) de ${HH} horas  de su contrato , puede que el tiempo de resolución sea mayor a las horas restantes`);
                    $('#alertHoras').show();
                } else {
                    $('#alertHoras').html(` <i style="font-size:24px" class="fas float-left  fa-exclamation-circle"></i> Le quedan  (${R} minutos) de ${HH} horas  de su contrato , puede que el tiempo de resolución sea mayor a las horas restantes`);
                    $('#alertHoras').show();
                }
            } else{
                $('#informe').html(` <i style="font-size:24px" class="fas float-left fa-hourglass-half"></i>Le quedan (${R} horas) de ${HH} horas  de su contrato`);
                $('#informe').show();
            }
            localStorage['HORAS_CONSUMIDAS'] = R;
        }

    });
}

const change = () => {
    $('#alertHoras').hide();
    $('#informe').hide();
    const N = $('#NUMERO_CONTRATO').val();
    VertificarHoras(N);
}



const LISTARCONTRATOS = () => {

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/contrato/sap/${COD_CLIENTE}`,
        type: "GET",
        dataType:'json',
        success: function (rs){
            select = $(`#NUMERO_CONTRATO`);
            if(rs.length == 1) {
                select.append(`<option selected  value="${rs[0].NUMERO_CONTRATO}">${rs[0].TIPO_CONTRATO}</option>`);
                select.prop('disabled',true);
                VertificarHoras(rs[0].NUMERO_CONTRATO);
            } else {
                $.each(rs , function(x,v){
                    select.append(`<option value="${v.NUMERO_CONTRATO}">${v.TIPO_CONTRATO}</option>`);
                });
             }
            change();
        }
    });

    
}

const RegistrarSolicitud = (event) => {
    $('#load').show();
    $('#crear').hide();
    event.preventDefault();
    var d = new Date();
    var Hora = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
    var Fecha = d.getUTCFullYear() +"-"+ d.getMonth() + 1 +"-"+ d.getDate().toString();
    var DATE = d.getUTCFullYear() +""+ d.getMonth() +""+ d.getUTCDate()  +""+ d.getHours() +""+ d.getMinutes() +""+ d.getSeconds();
    var input = document.getElementById('files');
    var files = input.files;
    var formData = new FormData();
    for (var i = 0; i != files.length; i++) {
        formData.append("file", files[i]);
    }
    var COD = DATE + document.getElementById('files').files[0].name;
    $.ajax({

        url: `http://localhost:8000/api/TRAER/COD_PERSONA_CONTACTO/${$('#NUMERO_CONTRATO').val()}`,
        type:"GET",
        dataType:'json',
        success: function (res) {
           
            const data = [{

                COD_USUARIO_SOLICITANTE: parseInt(GcodigoUsuario),
                FECHA_SOLICITUD: Fecha,
                HORA_SOLICITUD: Hora ,
                NIVEL_URGENCIA: $('#urgencia').val(),
                TIPO_PROBLEMA: $('#tipo_problema option:selected').text(),
                COMENTARIO: $('#COMENTARIO').val(),
                URL_ADJUNTO: COD ,
                DESCRIPCION: $('#DESCRIPCION').val(),
                ID_CONTRATO: $('#NUMERO_CONTRATO').val(),
                TIPO_CONTRATO: $('#NUMERO_CONTRATO option:selected').text(),
                CORREO: localStorage['CORREO'],
                CLIENTE:localStorage['USUARIO'], // "CustmrName" 
                COD_PERSONA_CONTRATO: parseInt(res[0].COD_PERSONA_CONTRATO), //""ContactCode": ": 
                COD_CLIENTE : localStorage['COD_CLIENTE'], //"CustomerCode": 
                HORAS_CONSUMIDAS : localStorage['HORAS_CONSUMIDAS'], //"U_HCONSUMIDAS": 
                COD_TIPO_PROBLEMA : parseInt($('#tipo_problema').val()), //"problemType": 
            }]; 
        
        
            $.ajax({
        
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                url: `http://localhost:8000/api/ticket`,
                type: "POST",
                data:JSON.stringify(data),
                success: function (){
        
                    $.ajax({
                        url: `http://localhost:8000/api/ticket/ADJUNTO/${COD}`,
                        data: formData,
                        type:"POST",
                        processData: false,
                        contentType: false,
                        success: function (res) {
                     
                            Swal.fire({
                                icon: 'success',
                                text:'Ticket creado',
                                showConfirmButton: false,
                                timer: 1200
                            });
        
                            $("#RegistrarSolicitud")[0].reset();
                            $('#load').hide();
                            $('#crear').show();
                            $('#alertHoras').hide();
                            $('#informe').hide();
                            $('#Noti').hide();
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
                    $('#load').hide();
                    $('#crear').show();
                    Swal.fire({
                        icon: 'warning',
                        text:'No esta vinculado a un contrato.',
                        showConfirmButton: false,
                        timer: 1800
                    });
                }
            });
        
        }               

    });

   


};


