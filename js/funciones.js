import UI from "../js/ui.js";
import Citas from "../js/citas.js";
import {DB} from "../js/App.js";

import {mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario} from '../js/selectores.js';

export const administrarCitas = new Citas();
export const ui = new UI(administrarCitas);

let editando = false;

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora:'',
    sintomas: ''
}

export function datosCita(e) {
    //  console.log(e.target.name) // Obtener el Input
    citaObj[e.target.name] = e.target.value;
}

export function nuevaCita(e) {
    e.preventDefault();

    const {mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar
    if( mascota === '' || propietario === '' || telefono === '' || fecha === ''  || hora === '' || sintomas === '' ) {
        ui.imprimirAlerta('Todos los mensajes son Obligatorios', 'error')

        return;
    }

    if(editando) {
        // Estamos editando
        administrarCitas.editarCita( {...citaObj} );

        //edita en indexDB
        const transaction = DB.transaction(['data'], 'readwrite');
        const objectStore = transaction.objectStore('data');

        objectStore.put(citaObj);

        transaction.oncomplete = function() {

            ui.imprimirAlerta('Guardado Correctamente');
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
            editando = false;

        }

        transaction.onerror = function() {
            console.log('hubo un error');
        }

        

    } else {
        // Nuevo Registro

        // Generar un ID único
        citaObj.id = Date.now();
        
        // Añade la nueva cita
        administrarCitas.agregarCita({...citaObj});

        //insertar registro en indexDB 
        const transaction = DB.transaction(['data'], 'readwrite');
        
        //habilitar objectStore
        const objectStore = transaction.objectStore('data');
        
        //insertar a base de datos
        objectStore.add(citaObj);

        transaction.oncomplete = function() {
            console.log('cita agregada a DB');
            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Se agregó correctamente')
        }
    }


    // Imprimir el HTML de citas
    ui.imprimirCitas(administrarCitas);

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();

}

export function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}


export function eliminarCita(id) {
    const transaction = DB.transaction(['data'], 'readwrite');
    const objectStore = transaction.objectStore('data');

    objectStore.delete(id);

    transaction.oncomplete = function() {
        console.log(`cita ${id} eliminada...`);
        ui.imprimirCitas();
    }

    transaction.onerror = function() {
        console.log('hubo un error');
    }
}

export function cargarEdicion(cita) {

    const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Reiniciar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Llenar los Inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;

}