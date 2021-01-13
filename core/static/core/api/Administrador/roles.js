$( document ).ready(function() {
    ListarRoles();
});

const GuardarRol = (event) => {

    event.preventDefault();

    var NOMBRE_ROL = $('#NOMBRE_ROL').val();

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/roles`,
        type: "POST",
        data:JSON.stringify({ NOMBRE_ROL: NOMBRE_ROL}),
        success: function (rs){
   
            ListarRoles();
        }
    });


}

const ListarRoles = () => {

    $('#TablaRoles > tbody > tr').remove();
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/roles`,
        type: "GET",
        dataType:'json',
        success: function (rs){
   
            var $TABLA = $('#TablaRoles tbody');
            var $FILAS = ``;
     
            $.each(rs , function(x,v){
                $FILAS += `<tr>
                <td>${v.COD_ROL}</td>
                <td>${v.NOMBRE}</td>
                <td> <button type="button" onclick="EliminarRol('${v.COD_ROL}');"   class="btn btn-default p-0" ><i style="height: 25px;"  class="fas pt-2 text-danger fa-trash-alt"></i></button>  </td>
                </tr>`;
            });
            $TABLA.append($FILAS);
        }
    });
}

const EliminarRol = (CR) => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/roles/${CR}`,
        type: "DELETE",
        success: function (rs){
            ListarRoles();
        }
    });
}