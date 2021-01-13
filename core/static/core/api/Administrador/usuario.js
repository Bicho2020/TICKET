$( document ).ready(function() {
    ListarClienteCracion();
    ListarRolesRegistrar();
});

const ListarRolesRegistrar = () => {

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/roles`,
        type: "GET",
        dataType:'json',
        success: function (rs){
   
            var $OPTIONGROUP = $('#rol');
            var optionsg = '';
            optionsg += '<optgroup  label="Areas">'
     
            $.each(rs , function(x,v){
                optionsg += `<option value="${v.COD_ROL}">${v.NOMBRE}</option>`
            
            });

            optionsg += '</optgroup>'
            $OPTIONGROUP.append(optionsg);

        }
    });
}

const ListarClienteCracion = () => {

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


const RegistrarUsuario = (event) => {
    event.preventDefault()

    const data = [{

        NOMBRE_CLIENTE: $('#NOMBRE_CLIENTE option:selected').text() ,
        COD_CLIENTE :  $('#NOMBRE_CLIENTE').val(),

        NOMBRE_CONTACTO: $('#PERSONA_CONTACTO option:selected').text() ,
        COD_CONTACTO :  $('#PERSONA_CONTACTO').val(),

        

        CORREO:  $('#correo').val(),
        
        TELEFONO:  parseInt($('#telefono').val()),
        CONTRASEÑA: $('#passwd').val(),
        COD_ROL: parseInt($('#rol').val()),

    }]

    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/usuario`,
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
                text:'Error con el servidor',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });

}