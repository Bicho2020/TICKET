$(document).ready(function(){
    ListarSoluciones();
});

const ListarSoluciones = () => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/ticket/soliciones`,
        type: "GET",
        dataType:'json',
        success: function (rs){
            var tabla = $('#TablaSoluciones tbody');
            var filas = '';
            $.each(rs, function (i, v) { 
                if(v.SOLUCION == null){v.SOLUCION = '-'}
                if(v.ASUNTO == null){v.ASUNTO = '-'}
                if(v.PROBLEMA == null){v.PROBLEMA = '-'}
                if(v.COMENTARIO == null){v.COMENTARIO = '-'}
                if(v.CATEGORIA == null){v.CATEGORIA = '-'} else {v.CATEGORIA = $(`#CATEGORIA_SAP option[value=${v.CATEGORIA}]`).text()}
                if(v.STATUS == null){v.STATUS = '-'}else{ v.STATUS = $(`#ESTADO option[value=${v.STATUS}]`).text() };
                filas += `<tr>
                    <td>${v.ASUNTO}</td>
                    <td>${v.SOLUCION}</td>
                    <td>${v.PROBLEMA}</td>
                    <td>${v.COMENTARIO}</td>
                    <td>${v.CATEGORIA}</td>
                    <td>${v.STATUS}</td>
                </tr>`;
            });
            tabla.append(filas);
            $('#TablaSoluciones').DataTable({
                responsive: true,
                pageLength: 5,
                lengthMenu: [[5, 10, 20, -1], [5, 10, 20, "All"]],
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
            }});
        },
        error: function (){
            Swal.fire({
                icon: 'error',
                text:'ERROR SERVIDOR SAP',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });
}

const GuardarEstado = (e) => {
    e.preventDefault();
    
    const data = {
        itemCode: 'SAPSOP01' ,
        statusNum: parseInt($('#ESTADO').val()) ,
        Symplton: $('#SOLUCION').val() ,
        subject: $('#ASUNTO').val() ,
        description: $('#COMENTARIO').val() ,
        cause: $('#PROBLEMA').val() ,
        u_sap: $('#CATEGORIA_SAP').val() ,
    }

    Swal.fire('Porfavor Espere')
    Swal.showLoading();

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://10.0.2.2:59987/api/TicketSap/solucion`,
        type: "POST",
        data : JSON.stringify(data),
        success: function (){
            Swal.fire({
                icon: 'success',
                text:'SOLUCIÓN REGISTRADA CON EXITO',
                showConfirmButton: false,
                timer: 1500
            });
            $("#RegistrarFormulario")[0].reset();            
        },
        error: function (err){
            Swal.fire({
                icon: 'error',
                text:'ERROR SERVIDOR SAP',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });
  
}