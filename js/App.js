import {datosCita, nuevaCita, ui} from '../js/funciones.js'
import {mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario} from '../js/selectores.js';


export let DB;

class App {
    constructor() {
        this.initApp();
        this.initDB();
    }

    initApp() {
        mascotaInput.addEventListener('change', datosCita);
        propietarioInput.addEventListener('change', datosCita);
        telefonoInput.addEventListener('change', datosCita);
        fechaInput.addEventListener('change', datosCita);
        horaInput.addEventListener('change', datosCita);
        sintomasInput.addEventListener('change', datosCita);

        //formulario para nueva cita
        formulario.addEventListener('submit', nuevaCita);
    }

    initDB() {
        //crear la base de datos en version 1.0
        const objectDB = window.indexedDB.open('citas', 1);
        
        //si hay un error
        objectDB.onerror = function(e) {
            console.log(e);
        }

        //si todo sale bien
        objectDB.onsuccess = function(e) {
            DB = objectDB.result;

            ui.imprimirCitas();
        }

        //definir el schema
        objectDB.onupgradeneeded = function(e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('data', {
                keyPath: 'id',
                autoIncrement: true 
            });


            //Definir Columnas de la base de datos
            objectStore.createIndex('mascota', 'mascota', { unique: false });
            objectStore.createIndex('propietario', 'propietario', { unique: false });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('fecha', 'fecha', { unique: false });
            objectStore.createIndex('hora', 'hora', { unique: false });
            objectStore.createIndex('sintomas', 'sintomas', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });


            console.log('DB Creada y lista');
        }
    }


}

export default App;