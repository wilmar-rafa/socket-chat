

class Usuarios {

	constructor (){

		this.personas=[];
	}

	agregarPersona(id,nombre, sala){
		
		let persona={id, nombre, sala};

		this.personas.push(persona);

		//return this.personas;
		return this.getPersonasPorSala(sala);
	}

	getPersona (id){

		let persona= this.personas.filter(persona=>{
			return persona.id===id
		})[0];

		return persona;
	}

	getPersonas(){
		return this.personas;
	}

	getPersonasPorSala(sala){
		let personas= this.personas.filter(persona=>{
			return persona.sala===sala
		});

		return personas;

	}

	borrarPersona(id){
		let PersonaBorrada=this.getPersona(id);
		this.personas=this.personas.filter(persona=>{
			return persona.id!=id
		});

		return PersonaBorrada;
	}

}


module.exports={
	Usuarios
};