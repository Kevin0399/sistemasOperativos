
//Elementos HTML
// Mostramos en DOM el espacio donde se mostraran la cantidad de lotes pendientes
let contadorLotesPendientes = document.createElement('div');
// Mostramos en DOM el espacio donde se vera el numero de lote actual
let contadorLoteActual = document.createElement('div');
// Título para procesos pendientes
let tituloPendientes = document.createElement('h2');
// Tabla de procesos pendientes
let tablaEspera = document.createElement('table');
let encabezadoTablaEspera = document.createElement('tr');
// Contenedor de la tabla de espera
let tablaEsperaDiv = document.createElement('div');
// Título para proceso en ejecución
let tituloEjecucion = document.createElement('h2');
// Espacio de informacion sobre el proceso en ejecucion
let mostrarEjecucion = document.createElement('div');
// Título para procesos terminados
let tituloTerminados = document.createElement('h2');
// Tabla de procesos terminados
let tablaTerminados = document.createElement('table');
let encabezadoTablaTerminados = document.createElement('tr');
// Contenedor de la tabla de terminados
let tablaTerminadosDiv = document.createElement('div');
// Contenedor de los estados que puede tener un proceso
let contenedorEstados = document.createElement('div');
// Contenedor de la informacion de ejecucion
let ejecucionDiv = document.createElement('div');
let contenedorPrincipal = document.createElement('div');
// Contiene el global 
let contadorGlobal = document.createElement('div');

    let numProcesos = 0; // Número total de procesos
    let numLotes = Math.ceil(numProcesos / 4); // Calculamos la cantidad de lotes necesarios
    let lotesPendientes = numLotes; // Contador de lotes pendientes
    let tiempoTotalTranscurrido = 0; // Tiempo transcurrido del proceso en ejecucion


// Definición de la clase Proceso
class Proceso {
    constructor(nombre, operacion, valores, id, tiempoMax) {
        this.nombre = nombre;
        this.operacion = operacion;
        this.valores = valores;
        this.id = id;
        this.tiempoMax = tiempoMax;
        this.status = "ESPERA"; // Estado inicial
        this.resultado = null;
    }
};

// Funcion que lleva a cabo la ejecucion de un proceso
const ejecutarProceso = async () => {
    let numLoteActual = numLotes - lotesPendientes + 1;
    lotesPendientes--;

    let loteActual = lotesTotales[numLoteActual - 1]; // Guardamos el lote actual

    for (let i = 0; i <= 3; i++) {
        let enEjecucion = loteActual[i];
        if (!enEjecucion) continue; // Evita procesos undefined

        enEjecucion.status = "EJECUCION"; // Cambiamos el estado para que ya no sea tomado como pendiente


        contadorLotesPendientes.innerText = `Lotes Pendientes: ${lotesPendientes}`;
        contadorLoteActual.innerText = `Lote Actual: ${numLoteActual}`;

        // Obtenemos los procesos que se encuentran en espera
        let procesosPendientes = loteActual.filter(proceso => proceso !== enEjecucion && proceso.status === "ESPERA");

        // Mostramos en pantalla la tabla de espera
        for (let k = 0; k < procesosPendientes.length; k++) {
            let fila = document.createElement('tr');
            fila.innerHTML = `<td>${procesosPendientes[k].nombre}</td><td>${((procesosPendientes[k].tiempoMax) / 1000).toFixed(1)} s </td>`;
            tablaEspera.appendChild(fila);
        }
        // Determinamos el simbolo de la operacion
        let simbolo = determinarOperacion(enEjecucion.operacion);

        // Espera el tiempo del proceso mostrando el cronómetro
        await cronometroAsync(enEjecucion);

        mostrarEjecucion.innerHTML = ""; // Limpiamos el espacio de ejecucion en pantalla

        // Limpiamos la tabla de espera en pantalla (excepto encabezado)
        while (tablaEspera.rows.length > 1) {
            tablaEspera.deleteRow(1);
        }


        // Al terminar, muestra el resultado con máximo 2 decimales
        enEjecucion.resultado = realizarOperacion(enEjecucion.operacion, enEjecucion.valores);
        enEjecucion.resultado = typeof enEjecucion.resultado === "number" // Formateamos el resultado
            ? enEjecucion.resultado.toFixed(2)
            : enEjecucion.resultado;
        enEjecucion.status = "TERMINADO"; // Marca el proceso como terminado


        // Agregamos el proceso terminado a la tabla de terminados
        let filaTerminado = document.createElement('tr');
        filaTerminado.innerHTML = `<td>${enEjecucion.id}</td>
                                   <td>${enEjecucion.valores[0]} ${simbolo} ${enEjecucion.valores[1]}</td>
                                   <td>${enEjecucion.resultado}</td>
                                   <td>${numLoteActual}</td>`;
        tablaTerminados.appendChild(filaTerminado);
    }
}

// Cronómetro asíncrono que espera el tiempo del proceso
const cronometroAsync = async (proceso) => {
    let tiempoTranscurrido = 0;
    let tiempoRestante = proceso.tiempoMax;
    const intervalo = 100; // Actualiza cada 100 ms

    return new Promise((resolve) => {
        const timer = setInterval(() => {
            tiempoTranscurrido += intervalo;
            tiempoRestante = proceso.tiempoMax - tiempoTranscurrido;
            tiempoTotalTranscurrido += intervalo; //  Actualizamos el tiempo global

            let simbolo = determinarOperacion(proceso.operacion);
            // Creamos una tabla para mostrar la informacion del proceso en ejecucion
            mostrarEjecucion.innerHTML = `
                <table class="infoProceso">
                    <tr><th colspan="2">Información del Proceso</th></tr>
                    <tr><td><b>Nombre:</b></td><td>${proceso.nombre}</td></tr>
                    <tr><td><b>Operación:</b></td><td>${proceso.valores[0]} ${simbolo} ${proceso.valores[1]}</td></tr>
                    <tr><td><b>ID:</b></td><td>${proceso.id}</td></tr>
                    <tr><td><b>TME:</b></td><td>${(proceso.tiempoMax / 1000).toFixed(1)} s (${proceso.tiempoMax} ms </td></tr>
                    <tr><td><b>Tiempo transcurrido:</b></td><td>${(tiempoTranscurrido / 1000).toFixed(1)} s (${tiempoTranscurrido} ms)</td></tr>
                    <tr><td><b>Tiempo restante:</b></td><td>${((proceso.tiempoMax - tiempoTranscurrido) / 1000).toFixed(1)} s (${Math.max(tiempoRestante, 0)} ms)</td></tr>
                </table>
            `;
            // Actualizamos el contador global
            contadorGlobal.innerText = `Tiempo total global: ${(tiempoTotalTranscurrido / 1000).toFixed(1)} s (${tiempoTotalTranscurrido}ms)`;

            if (tiempoTranscurrido >= proceso.tiempoMax) {
                clearInterval(timer);
                resolve();
            }
        }, intervalo);
    });
};

// Modifica iniciarProcesamiento para ser asíncrona
const iniciarProcesamiento = async () => {
    for (let i = 0; i < numLotes; i++) {
        await ejecutarProceso();
    }
}

/**
 * 
 * @param {String} operacion - Tipo de operacion a realizar
 */
// Solo determina el simbolo de la operacion
const determinarOperacion = (operacion) => {
    switch (operacion) {
        case 'suma': return '+';
        case 'resta': return '-';
        case 'multiplicacion': return '*';
        case 'division': return '/';
        case 'residuo': return '%';
        case 'potencia': return '^';
        default: return '?';
    }
};

/**
 * @param {string} operacion - Tipo de operacion a realizar
 * @param {Array} valores - Valores para la operacion
*/
const realizarOperacion = (operacion, valores) => {
    switch (operacion) {
        case 'suma': return valores[0] + valores[1];
        case 'resta': return valores[0] - valores[1];
        case 'multiplicacion': return valores[0] * valores[1];
        case 'division': return valores[0] / valores[1];
        case 'residuo': return valores[0] % valores[1];
        case 'potencia': return Math.pow(valores[0], valores[1]);
        default: return "Operación no válida";
    }
};

const main = async () => {

    // Todo esto son asignaciones de elementos HTML al DOM y creaciones de clases para css
    contadorLotesPendientes.classList.add('contadorLotesPendientes');
    contadorLoteActual.classList.add('contadorLoteActual');

    tituloPendientes.textContent = "Procesos Pendientes";

    encabezadoTablaEspera.innerHTML = "<th>NOMBRE</th><th>TME</th>";
    tablaEspera.appendChild(encabezadoTablaEspera);

    tablaEsperaDiv.classList.add('tablaEsperaDiv');
    tablaEsperaDiv.appendChild(tituloPendientes);
    tablaEsperaDiv.appendChild(tablaEspera);

    tituloEjecucion.textContent = "Proceso en Ejecución";

    mostrarEjecucion.classList.add('mostrarEjecucion');

    tituloTerminados.textContent = "Procesos Terminados";

    encabezadoTablaTerminados.innerHTML = "<th>ID</th><th>OPERACION</th><th>RESULTADO</th><th>NL</th>";
    tablaTerminados.appendChild(encabezadoTablaTerminados);

    tablaTerminadosDiv.classList.add('tablaTerminadosDiv');
    tablaTerminadosDiv.appendChild(tituloTerminados);
    tablaTerminadosDiv.appendChild(tablaTerminados);

    contenedorEstados.classList.add('contenedorEstados');
    contenedorEstados.appendChild(tablaEsperaDiv);

    ejecucionDiv.appendChild(tituloEjecucion);
    ejecucionDiv.appendChild(mostrarEjecucion);
    contenedorEstados.appendChild(ejecucionDiv);
    contenedorEstados.appendChild(tablaTerminadosDiv);

    contenedorPrincipal.classList.add('contenedorPrincipal');
    document.body.appendChild(contenedorPrincipal);
    contenedorPrincipal.appendChild(contadorLotesPendientes);
    contenedorPrincipal.appendChild(contadorLoteActual);
    contenedorPrincipal.appendChild(contenedorEstados);

    contadorGlobal.classList.add('contadorGlobal');
    contadorGlobal.innerText = "Tiempo total global: 0 segundos";
    contenedorPrincipal.appendChild(contadorGlobal);


    


    // Iniciamos el procesamiento de los lotes
    await iniciarProcesamiento();
    // Al finalizar, indicamos que ya no hay lotes
    contadorLoteActual.innerText = `Lote Actual: N/A`;

    // Boton para dar por finalizado el sistema 
    let btnFinalizar = document.createElement('button');
    btnFinalizar.classList.add('btnFinalizar');
    btnFinalizar.textContent = "Finalizar";
    contenedorPrincipal.appendChild(btnFinalizar);
    btnFinalizar.onclick = () => {
        location.reload(); // Recarga la página para reiniciar todo
    }
}

const recibirProcesosExternos = (procesosExternos) => {
    identificador = 0;
    lotesTotales = [];

    const idsGenerados = new Set();

    const procesos = procesosExternos.map(p => {
        const nuevoId = identificador++;

        // Verificar si el ID ya existe 
        if (idsGenerados.has(nuevoId)) {
            throw new Error(`ID duplicado detectado: ${nuevoId}`);
        }

        idsGenerados.add(nuevoId);

        return new Proceso(p.nombre, p.operacion, p.valores, nuevoId, p.tiempoMax);
    });

    numProcesos = procesos.length;
    numLotes = Math.ceil(numProcesos / 4);
    lotesPendientes = numLotes;

    // Agrupar los procesos en lotes de hasta 4
    for (let i = 0; i < numLotes; i++) {
        lotesTotales[i] = procesos.slice(i * 4, (i + 1) * 4);
    }
};

