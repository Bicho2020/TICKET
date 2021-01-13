$( document ).ready(function() {

    if(localStorage['CODIGO_USUARIO']){

        switch (localStorage['COD_ROL']) {
               
            case '1': 
                location.href ="http://localhost:8000/administrador/home"
                break;
            case '2': 

            location.href ="http://localhost:8000/soporte/home"
                break;
            case '3':
      
                location.href ="http://localhost:8000/cliente/home"
                break;
           }

    };


});

const Ingresar = (event) => {

    event.preventDefault()
   const correo = $('#correo').val();
   const paswd = $('#password').val();

    $.ajax({

        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        url: `http://localhost:8000/api/usuario/LOGIN/${correo}/${paswd}`,
        type: "POST",
        dataType: 'json',
        success: function (res){

           if(res.length == 0) {

               Swal.fire({
                    icon: 'error',
                    text: 'Credenciales erroneas',
                    showConfirmButton: false,
                    timer: 1200
               });

            }  else {

    

                if(res[0].COD_ROL == 3){

                    $.ajax({

                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                        url: `http://localhost:8000/api/usuario/verificar/contrato/${res[0].COD_CLIENTE}`,
                        type: "POST",
                        dataType: 'json',
                        success: function (r){
                            

                            if(r[0].RS == 0){

                                Swal.fire({
                                    icon: 'error',
                                    text:'Usuario sin contrato',
                                    showConfirmButton: false,
                                    timer: 1200
                                });

                            }else{
                                localStorage['CODIGO_USUARIO'] = res[0].COD_USUARIO
                                localStorage['COD_CLIENTE'] = res[0].COD_CLIENTE
                                localStorage['COD_ROL'] = res[0].COD_ROL
                                
                               
                                location.href ="http://localhost:8000/cliente/home/"
                                  
                               
                            }
                        }
                    });

                }else{

                    localStorage['CODIGO_USUARIO'] = res[0].COD_USUARIO
                    localStorage['COD_CLIENTE'] = res[0].COD_CLIENTE
                    localStorage['COD_ROL'] = res[0].COD_ROL


                    if((res[0].COD_ROL == 1 || res[0].COD_ROL == 2 || res[0].COD_ROL == 3 )){
                        switch (res[0].COD_ROL) {
                    
                            case 1: 
                                location.href ="http://localhost:8000/administrador/home/"
                                break;
                            case 2: 
                               location.href ="http://localhost:8000/soporte/home/"
                               break;
                            case 3:
                                location.href ="http://localhost:8000/cliente/home/"
                                break;
                        }

                    } else {
                        location.href ="http://localhost:8000/soporte/home/"
                    }
                    
                   
                }

               

            }
          

        },
        error: function (err){
            
            Swal.fire({
                icon: 'error',
                text:'Servidor',
                showConfirmButton: false,
                timer: 1200
            });
        }
    });
}