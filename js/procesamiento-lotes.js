
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

// Funcion que gestiona la creacion de los formularios de entrada
const crearFormularios = async () => {
    const numProcesos = parseInt(document.getElementById("numProcesos").value);
    const form = document.getElementById("formProcesos");
    const divIngresarCant = document.getElementById("contenedor");
    form.innerHTML = ""; // Limpia el contenido anterior

    // Validación simple
    if (isNaN(numProcesos) || numProcesos < 1) {
        alert("Por favor, ingresa un número mayor a 0.");
        return;
    }

    // Arreglo que almacenará todos los procesos confirmados
    let procesosConfirmados = [];

    // Mostrar un formulario a la vez
    for (let i = 0; i < numProcesos; i++) {
        // Espera a que el usuario confirme un proceso antes de mostrar el siguiente
        const proceso = await imprimirForm(form, procesosConfirmados);
        procesosConfirmados.push(proceso);
    }

    form.innerHTML = ""; // Borra formulario anterior
    divIngresarCant.innerHTML = "";
    recibirProcesos(procesosConfirmados); // Mandamos el arreglo que contiene todos los procesos
};

/**
 * 
 * @param {ElementoHTML} form 
 * @param {Array} procesosConfirmados 
 * @returns {Promise}
 */
// Se encarga de imprimir el formulario paracada entrada de proceso
const imprimirForm = (form, procesosConfirmados) => {
    return new Promise((resolve) => {
        form.innerHTML = ""; // Borra formulario anterior

        // Crear estructura del formulario dinámicamente
        const div = document.createElement("div");
        div.classList.add("proceso");

        div.innerHTML = `
            <h3>Proceso</h3>
            <label>Nombre: <input type="text" name="nombre" required></label><br><br>
            <label>ID: <input type="number" name="id" required></label><br><br>
            <label>Operación: 
                <select name="operacion" required>
                    <option value="+">Suma (+)</option>
                    <option value="-">Resta (-)</option>
                    <option value="*">Multiplicación (*)</option>
                    <option value="/">División (/)</option>
                    <option value="%">Residuo (%)</option>
                    <option value="^">Potencia (^)</option>
                </select>
            </label><br><br>
            <label>Dato 1: <input type="number" name="dato1" required></label><br><br>
            <label>Dato 2: <input type="number" name="dato2" required></label><br><br>
            <label>TME: <input type="number" name="tme" required></label><br><br>
        `;

        // Botón para confirmar y guardar el proceso
        const btnConfirmar = document.createElement("button");
        btnConfirmar.type = "button";
        btnConfirmar.textContent = "Confirmar";

        // Agregamos el botón al formulario
        div.appendChild(btnConfirmar);
        form.appendChild(div);


        btnConfirmar.addEventListener("click", () => {
            // Obtenemos los valores ingresados por el usuario
            const nombre = div.querySelector(`input[name="nombre"]`).value.trim();
            const id = parseInt(div.querySelector(`input[name="id"]`).value);
            const operacion = div.querySelector(`select[name="operacion"]`).value;
            const dato1 = parseFloat(div.querySelector(`input[name="dato1"]`).value);
            const dato2 = parseFloat(div.querySelector(`input[name="dato2"]`).value);
            const tme = parseFloat(div.querySelector(`input[name="tme"]`).value);

            //  Validaciones

            // Campos vacíos o inválidos
            if (!nombre || isNaN(id) || isNaN(dato1) || isNaN(dato2) || isNaN(tme)) {
                alert("Todos los campos son obligatorios y deben ser válidos.");
                return;
            }

            // ID duplicado
            if (procesosConfirmados.some(proc => proc.id === id)) {
                alert("El ID ya ha sido utilizado. Debe ser único.");
                return;
            }

            // División o residuo por cero
            if ((operacion === "/" || operacion === "%") && dato2 === 0) {
                alert("No se puede dividir o calcular residuo por cero.");
                return;
            }

            // TME no válido
            if (tme <= 0) {
                alert("El tiempo máximo estimado debe ser mayor a cero.");
                return;
            }

            // Crear y devolver el nuevo proceso
            const operacionTexto = convertirSimboloOperacion(operacion);
            const nuevoProceso = new Proceso(nombre, operacionTexto, [dato1, dato2], id, tme);

            resolve(nuevoProceso); // Devuelve el proceso al flujo principal
        });
    });
};

/**
 * 
 * @param {String} simbolo simbolo matematico
 * @returns 
 */
// Función para convertir símbolos a nombres compatibles
const convertirSimboloOperacion = (simbolo) => {
    switch (simbolo) {
        case "+": return "suma";
        case "-": return "resta";
        case "*": return "multiplicacion";
        case "/": return "division";
        case "%": return "residuo";
        case "^": return "potencia";
        default: return "desconocida";
    }
}

// ---------------PROCESAMIENTO----------------

//Elementos HTML

let contadorLotesPendientes   = document.createElement('div'); // Mostramos en DOM el espacio donde se mostraran la cantidad de lotes pendientes
let contadorLoteActual        = document.createElement('div'); // Mostramos en DOM el espacio donde se vera el numero de lote actual
let tituloPendientes          = document.createElement('h2'); // Título para procesos pendientes
let tablaEspera               = document.createElement('table'); // Tabla de procesos pendientes
let encabezadoTablaEspera     = document.createElement('tr');
let tablaEsperaDiv            = document.createElement('div'); // Contenedor de la tabla de espera
let tituloEjecucion           = document.createElement('h2'); // Título para proceso en ejecución
let mostrarEjecucion          = document.createElement('div'); // Espacio de informacion sobre el proceso en ejecucion
let tituloTerminados          = document.createElement('h2'); // Título para procesos terminados
let tablaTerminados           = document.createElement('table'); // Tabla de procesos terminados
let encabezadoTablaTerminados = document.createElement('tr');
let tablaTerminadosDiv        = document.createElement('div'); // Contenedor de la tabla de terminados
let contenedorEstados         = document.createElement('div'); // Contenedor de los estados que puede tener un proceso
let ejecucionDiv              = document.createElement('div'); // Contenedor de la informacion de ejecucion
let contenedorPrincipal       = document.createElement('div');
let contadorGlobal            = document.createElement('div'); // Contiene el contador global 

let numProcesos = 0; // Número total de procesos
let numLotes = Math.ceil(numProcesos / 4); // Calculamos la cantidad de lotes necesarios
let lotesPendientes = numLotes; // Contador de lotes pendientes
let tiempoTotalTranscurrido = 0; // Tiempo transcurrido del proceso en ejecucion

/**
 * 
 * @param {Array<Proceso>} procesosExternos Arreglo de objetos Proceso
 */
// Funcion que gestiona la organizacion de los lotes
const recibirProcesos = (procesosExternos) => {
    lotesTotales = [];

    const procesos = procesosExternos.map(p => {
        return new Proceso(p.nombre, p.operacion, p.valores, p.id, p.tiempoMax);
    });

    numProcesos = procesos.length; // Guardamos el numero de procesos
    numLotes = Math.ceil(numProcesos / 4); // Calculamos la cantidad de lotes necesarios
    lotesPendientes = numLotes; 

    // Agrupar los procesos en lotes de hasta 4
    for (let i = 0; i < numLotes; i++) {
        lotesTotales[i] = procesos.slice(i * 4, (i + 1) * 4);
    }
    main(); // Ejecutamos la funcion principal del procesamiento
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

// Gestiona las iteraciones para realizar cada proceso de manera secuencial
const iniciarProcesamiento = async () => {
    for (let i = 0; i < numLotes; i++) {
        await ejecutarProceso();
    }
}

// Funcion que lleva a cabo la ejecucion de un proceso
const ejecutarProceso = async () => {
    let numLoteActual = numLotes - lotesPendientes + 1;
    lotesPendientes--;

    let loteActual = lotesTotales[numLoteActual - 1]; // Guardamos el lote actual

    for (let i = 0; i <= 3; i++) {
        let enEjecucion = loteActual[i];
        if (!enEjecucion) continue; // Evitamos procesos undefined

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

/**
 * 
 * @param {Objeto<Proceso>} proceso Recibe el proceso en ejecucion
 * @returns 
 */
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
