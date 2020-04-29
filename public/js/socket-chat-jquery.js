

var html= "";
var divUsuarios=$('#divUsuarios');
var formEnviar=$('#formEnviar');
var txtMensaje=$('#txtMensaje');
var divChatbox=$('#divChatbox');
var salaTitle =$('#salaTitle');
var tipoChat  ='sala';

var params= new URLSearchParams(window.location.search);
var nombre= params.get('nombre');
var sala= params.get('sala');

function ListaUsuarios (usuarios){
	html= "";
	html+='<li>';
	html+=    '<a href="javascript:void(0)" class="active"> Chat de <span> '+params.get('sala')+'</span></a>';
	html+='</li>';

	//console.log(html);

	usuarios.forEach(itemListaUsuarios);

	divUsuarios.html(html);

	salaTitle.html(params.get('sala'));

}

function itemListaUsuarios(usuario, i) {

		html+='<li>';
        html+=    '<a data-id="'+usuario.id+'" data-nombre="'+usuario.nombre+'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+usuario.nombre+'<small class="text-success">online</small></span></a>';
        html+='</li>';
			
	};

function ListaMensajes(mensaje,yo){
	html="";

	var fecha = new Date(mensaje.fecha);
	var hora = fecha.getHours()+":"+fecha.getMinutes();

	var adminClass="info";
	if (mensaje.nombre==="Administrador"){
		adminClass="danger";
	}

	if(yo){
			html+='<li class="reverse mensajeSala">';
            html+='    <div class="chat-content">';
            html+='        <h5>'+mensaje.nombre+'</h5>';
            html+='        <div class="box bg-light-inverse">'+mensaje.mensaje+'</div>';
            html+='    </div>';
            html+='    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
            html+='    <div class="chat-time">'+hora+'</div>';
            html+='</li>';

	}else{
			
			html+='<li class="animated fadeIn mensajeSala">';
			
			if (mensaje.nombre!=="Administrador"){
		    	html+='    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
		    }
		    
		    html+='    <div class="chat-content">';
		    html+='        <h5>'+mensaje.nombre+'</h5>';
		    html+='        <div class="box bg-light-'+adminClass+'">'+mensaje.mensaje+'</div>';
		    html+='    </div>';
		    html+='    <div class="chat-time">'+hora+'</div>';
		    html+='</li>';
	}


    //console.log(html);
    divChatbox.append(html);

}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

divUsuarios.on('click','a',function (){

	$("#divUsuarios li a").removeClass('box bg-light-danger');

	$(this).addClass('box bg-light-danger');

	id= $(this).data('id');
	if(id){
		console.log('id',id);
		//window.location = 'chatPrivado.html?id=?'+id;
		//$('.mensajeSala').hide();
		tipoChat  ='privado';

	}else{
		tipoChat  ='sala';
	}
	
});	

formEnviar.on('submit',function(e){

	e.preventDefault();


	if(txtMensaje.val().trim().length===0){

		return;
	}
	
	console.log(tipoChat);

	if (tipoChat==='sala'){
		socket.emit('crearMensaje', {
		    usuario : nombre,
		    sala	:sala,
		    mensaje: txtMensaje.val()
		}, function(mensaje) {
			console.log('recibido:',mensaje);
	    	txtMensaje.val("").focus();

	    	ListaMensajes(mensaje,true);
	    	scrollBottom();
		});
	}else if (tipoChat==='privado'){
		socket.emit('MensajePrivado', {
		    usuario : nombre,
		    para	:id,
		    mensaje: txtMensaje.val()
		}, function(mensaje) {
			console.log('recibido:',mensaje);
	    	txtMensaje.val("").focus();

	    	ListaMensajes(mensaje,true);
	    	scrollBottom();
		});
	}
	
	

});