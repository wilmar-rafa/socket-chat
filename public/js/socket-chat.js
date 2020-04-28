var socket = io();

var params= new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')){
	window.location = 'index.html';

	throw new Error('El nombre es necesario y sala son necesarios');
}

var usuario={
	nombre: params.get('nombre'),
	sala: 	params.get('sala'), 
}


socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarchat',usuario,function(resp){

    	console.log('Usuarios conectados',resp);
    	ListaUsuarios (resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/*socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});*/

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);
    ListaMensajes(mensaje,false);
    scrollBottom();

});

socket.on('MensajePrivado', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//Escuchar cambios de usuarios
socket.on('listaPersonas', function(personas) {

    console.log('Servidor:', personas);
    ListaUsuarios (personas);

});
