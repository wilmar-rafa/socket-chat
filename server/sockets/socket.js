const { io } = require('../server');

const {Usuarios} = require('../classes/Usuarios');


const usuarios = new Usuarios();
const {crearMensaje} = require('../utilidades/utilidades');

io.on('connection', (client) => {

    console.log('Usuario conectado');


    client.on('entrarchat',(usuario,callback)=>{
    	console.log(usuario);

    	if(!usuario.nombre || !usuario.sala){
    		return callback({
    			error: true,
    			mensaje: 'El nombre y la sala son necesarios'
    		});
    	}

    	client.join(usuario.sala);

    	let personas=usuarios.agregarPersona(client.id,usuario.nombre,usuario.sala)

    	client.broadcast.to(usuario.sala).emit('crearMensaje',crearMensaje('Administrador',`${usuario.nombre} se unió`));
    	client.broadcast.to(usuario.sala).emit('listaPersonas',usuarios.getPersonasPorSala(usuario.sala));

    	callback(personas); 

    });

    client.on('crearMensaje',(data,callback)=>{

    	let persona=usuarios.getPersona(client.id);
    	let mensaje=crearMensaje(persona.nombre,data.mensaje);
    	client.broadcast.to(data.sala).emit('crearMensaje',mensaje);

    	callback(mensaje);
    })

    client.on('MensajePrivado',(data)=>{

    	let persona=usuarios.getPersona(client.id);
    	client.broadcast.to(data.para).emit('MensajePrivado',crearMensaje(persona.nombre,data.mensaje));
    })

    client.on('disconnect',()=>{
    	let personaBorrada= usuarios.borrarPersona(client.id);

    	client.broadcast.to(personaBorrada.sala).emit('crearMensaje',crearMensaje('Administrador',`${personaBorrada.nombre} abandonó el chat`));

    	client.broadcast.to(personaBorrada.sala).emit('listaPersonas',usuarios.getPersonasPorSala(personaBorrada.sala));


    });

});

