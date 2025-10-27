/*
  main.js - comentarios y notas

  Nota importante (bug conocido):
  - En la versión actual `pantalla` se obtiene dentro del handler
    `DOMContentLoaded` como `const pantalla = document.getElementById('pantalla');`.
    Sin embargo, las funciones globales definidas más abajo (`agregarOperador`,
    `calcular`, `limpiar`, `borrar`, ...) referencian `pantalla` como si fuera
    una variable global. Eso produce un ReferenceError en tiempo de ejecución
    porque `pantalla` no está en el scope global.

  Soluciones posibles (elige una):
  1) Declarar `pantalla` como variable global y asignarla en DOMContentLoaded:
       let pantalla;
       document.addEventListener('DOMContentLoaded', () => {
         pantalla = document.getElementById('pantalla');
       });

  2) Hacer que cada función obtenga `document.getElementById('pantalla')`
     cuando lo necesite (más seguro si el DOM podría reinicializarse).

  3) Mover las definiciones de las funciones dentro del callback
     `DOMContentLoaded` para que compartan el mismo scope que `pantalla`.

  En este repositorio dejé las funciones tal cual para no cambiar el comportamiento
  automáticamente, pero añado esta explicación para que entiendas por qué
  podrían fallar los event listeners o las llamadas a `borrar`/`calcular`.
*/

// Registrar listeners después de que el DOM esté listo.
// Algunos elementos (por ejemplo, un <div> de pantalla) no reciben eventos
// de teclado a menos que tengan foco. Es más fiable escuchar a nivel
// de document para capturar pulsaciones globales.
document.addEventListener('DOMContentLoaded', () => {
    const pantalla = document.getElementById('pantalla');

    // Listener global de teclado: captura teclas numéricas y las añade a la pantalla.
    document.addEventListener('keydown', function (e) {
        // Evitar interferir con modificadores o atajos del sistema
        if (e.altKey || e.ctrlKey || e.metaKey) return;

        // Sólo permitir los dígitos y algunos operadores básicos aquí si se desea
        switch (e.key) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                pantalla.innerText += e.key;
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                pantalla.innerText += e.key;
                break;
            case 'Backspace':
                // Reutilizar la función borrar si está definida en este scope
                // (llamamos a la función global que modificará pantalla)
                if (typeof window.borrar === 'function') {
                    window.borrar();
                } else {
                    const texto = String(pantalla.textContent || '');
                    pantalla.textContent = texto.length <= 1 ? '0' : texto.slice(0, -1);
                }
                break;
            case 'Enter':
                if (typeof window.calcular === 'function') window.calcular();
                break;
        }
    });
});

/**
 * Añade un dígito a la pantalla.
 * @param {number|string} numero - Dígito a añadir (0-9).
 * Comportamiento:
 *  - Si la pantalla contiene 'Error Math' o '0' se reemplaza por el número.
 *  - En otro caso se concatena el dígito.
 */
function agregarNumero(numero){
    const pantalla = document.getElementById('pantalla');
    if (!pantalla) return;

    if (pantalla.textContent === 'Error Math' || pantalla.textContent === '0') {
        pantalla.textContent = String(numero);
        return;
    }

    pantalla.textContent += String(numero);
}

/**
 * Añade un operador (+ - * / %) al final de la expresión en pantalla.
 * @param {string} operador
 */
function agregarOperador(operador){
    const pantalla = document.getElementById('pantalla');
    if (!pantalla) return;
    pantalla.textContent += operador;
}

/**
 * Evalúa la expresión actualmente mostrada en pantalla.
 * - Usa `eval()` (nota: inseguro para entrada arbitraria).
 * - Si la evaluación produce Infinity o lanza un error, muestra 'Error Math'.
 */
function calcular(){
    const pantalla = document.getElementById('pantalla');
    if (!pantalla) return;
    try {
        // Intentamos evaluar la expresión
        const resultado = eval(pantalla.textContent);
        pantalla.textContent = String(resultado);
        if (pantalla.textContent === 'Infinity') {
            pantalla.textContent = 'Error Math';
        }
    } catch (error) {
        pantalla.textContent = 'Error Math';
    }
}

/**
 * Añade un punto decimal al número actual si aún no tiene uno.
 * Busca el último operador y solo permite un punto en la porción posterior.
 */
function agregarDecimal(){
    const pantalla = document.getElementById('pantalla');
    if (!pantalla) return;

    const texto = pantalla.textContent || '';
    // Buscar el último operador para determinar el número actual
    let ultimoOperador = -1;
    ["+","-","*","/","%"].forEach(op => {
        const i = texto.lastIndexOf(op);
        if (i > ultimoOperador) ultimoOperador = i;
    });

    const numeroActual = texto.slice(ultimoOperador + 1);
    if (!numeroActual.includes('.')) {
        pantalla.textContent += '.';
    }
}

/**
 * Reinicia la pantalla a '0'.
 */
function limpiar(){
    const pantalla = document.getElementById('pantalla');
    if (!pantalla) return;
    pantalla.textContent = '0';
}

/**
 * Borra el último carácter de la pantalla. Si queda vacío, deja '0'.
 */
function borrar(){
    const pantalla = document.getElementById('pantalla');
    if (!pantalla) return;

    const texto = String(pantalla.textContent || '');
    if (texto.length <= 1) {
        pantalla.textContent = '0';
        return;
    }
    pantalla.textContent = texto.slice(0, -1);
}