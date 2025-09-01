
const crearFormularios = () => {
  const numProcesos = document.getElementById("numProcesos").value;
  const form = document.getElementById("formProcesos");
  form.innerHTML = "";

  if (numProcesos < 1) {
    alert("Por favor, ingresa un número mayor a 0.");
    return;
  }

  for (let i = 1; i <= numProcesos; i++) {
    const div = document.createElement("div");
    div.classList.add("proceso");
    div.innerHTML = `
      <h3>Proceso ${i}</h3>
      <label>Nombre: <input type="text" name="nombre${i}" required></label><br><br>
      <label>Operación: 
        <select name="operacion${i}">
          <option value="+">Suma (+)</option>
          <option value="-">Resta (-)</option>
          <option value="*">Multiplicación (*)</option>
          <option value="/">División (/)</option>
          <option value="%">Residuo (%)</option>
          <option value="^">Potencia (^)</option>
        </select>
      </label><br><br>
      <label>Dato 1: <input type="number" name="dato1_${i}" required></label><br><br>
      <label>Dato 2: <input type="number" name="dato2_${i}" required></label><br><br>
    `;
    form.appendChild(div);
  }

  // Botón Ejecutar
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = "Ejecutar Procesos";
  boton.onclick = ejecutarProcesos;
  form.appendChild(boton);

  // Botón Reiniciar
  const botonReiniciar = document.createElement("button");
  botonReiniciar.type = "button";
  botonReiniciar.textContent = "Reiniciar";
  botonReiniciar.style.marginLeft = "10px";
  botonReiniciar.onclick = reiniciarProcesos;
  form.appendChild(botonReiniciar);
}

const ejecutarProcesos = async () => {
  const form = document.getElementById("formProcesos");
  const procesos = form.querySelectorAll(".proceso");
  let procesosManuales = [];

  for (let index = 0; index < procesos.length; index++) {
    const proceso = procesos[index];

    const nombre = proceso.querySelector(`input[name="nombre${index + 1}"]`).value.trim();
    const operacion = proceso.querySelector(`select[name="operacion${index + 1}"]`).value;
    const dato1 = parseFloat(proceso.querySelector(`input[name="dato1_${index + 1}"]`).value);
    const dato2 = parseFloat(proceso.querySelector(`input[name="dato2_${index + 1}"]`).value);

    if (nombre === "" || isNaN(dato1) || isNaN(dato2)) {
      alert(`Todos los campos del Proceso ${index + 1} deben estar completos.`);
      return;
    }

    if ((operacion === "/" || operacion === "%") && dato2 === 0) {
      alert(`Error en Proceso ${index + 1}: No se puede dividir o sacar residuo entre 0.`);
      return;
    }

    const operacionTexto = convertirSimboloOperacion(operacion);
    const tiempoMax = Math.floor(Math.random() * 5000) + 2000;

    // Crear instancia de Proceso
    const procesoManual = new Proceso(nombre, operacionTexto, [dato1, dato2], index, tiempoMax);
    procesosManuales.push(procesoManual);
  }

  // Enviar los procesos al primer archivo
  if (typeof recibirProcesosExternos === "function") {
    await recibirProcesosExternos(procesosManuales);
    let contenedorForm = document.getElementById('contenedor');
    contenedorForm.remove();
    main(); // Llamar a main para iniciar el procesamiento

  } else {
    alert("No se pudo encontrar la función de procesamiento principal.");
  }
}

function reiniciarProcesos() {
  document.getElementById("formProcesos").innerHTML = "";
  document.getElementById("numProcesos").value = "";
}

// Utilidad para convertir símbolos a nombres compatibles
function convertirSimboloOperacion(simbolo) {
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




