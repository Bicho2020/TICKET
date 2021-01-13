$( document ).ready(function() {
    COD_CLIENTE = localStorage['CODIGO_USUARIO'];
    ReporteriaCliente()

});

const ReporteriaCliente = () => {

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/reporteria/TOP_3_TIPO_CONTRATO/${COD_CLIENTE}`,
        type: "GET",
        dataType: 'json',
        success: function (rs){
            console.log(rs);
            Highcharts.chart('container', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Top tipos de contratos solicitados'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}'
                },
                
                
                plotOptions: {
                    pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f}% '
                    }
                    }
                },
                series: [{
                    name: 'Total',
                    colorByPoint: true,
                    data: rs
                }]
                });

        }
    });

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/reporteria/TOP_3_TIPO_PROBLEMA/${COD_CLIENTE}`,
        type: "GET",
        dataType: 'json',
        success: function (rs){
            console.log(rs);
            Highcharts.chart('container_2', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Top tipos de problemas de ticket solicitados'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}'
                },
                
                
                plotOptions: {
                    pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f}% '
                    }
                    }
                },
                series: [{
                    name: 'Total',
                    colorByPoint: true,
                    data: rs
                }]
                });

        }
    });
    
    
}
