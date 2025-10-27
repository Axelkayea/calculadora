# Calculadora (CAW)

Pequeña calculadora web con HTML/CSS/JS. Este repositorio contiene una interfaz
simple y el script `main.js` con las funciones principales.

## Estructura

- `index.html` - marcado HTML con la pantalla y los botones de la calculadora.
- `style.css` - estilos para la calculadora.
- `main.js` - lógica JavaScript (entrada, operadores, cálculo, borrado).

## Resumen de funciones en `main.js`

- `agregarNumero(numero)`
  - Añade el dígito `numero` al contenido de la pantalla.
  - Si la pantalla contiene `0` o `Error Math` reemplaza con el número.
  - Nota: la función obtiene `document.getElementById('pantalla')` cada vez
    para protegerse si se llama antes de que el DOM esté listo.

- `agregarOperador(operador)`
  - Añade el operador al final de la cadena mostrada en la pantalla.
  - Actualmente asume que existe una variable `pantalla` accesible.

- `agregarDecimal()`
  - (Si existe) añade un punto decimal si no hay uno en el número actual.

- `calcular()`
  - Intenta evaluar la expresión en `pantalla.textContent` usando `eval()`.
  - Si la operación da `Infinity` o lanza error, escribe `Error Math`.
  - **Aviso de seguridad**: `eval()` ejecuta código arbitrario. En un
    proyecto real conviene reemplazarlo por un parser/evaluador seguro.

- `limpiar()`
  - Resetea la pantalla a `'0'`.

- `borrar()`
  - Elimina el último carácter mostrado; si queda vacío lo sustituye por `'0'`.

## Bug conocido y por qué puede fallar

En la versión actual del archivo `main.js`, `pantalla` se crea dentro del
callback `DOMContentLoaded` como `const pantalla = document.getElementById('pantalla');`.
Sin embargo, varias funciones globales (`agregarOperador`, `calcular`, `limpiar`,
`borrar`) asumen que `pantalla` es una variable global. Eso provoca un
ReferenceError cuando se llaman esas funciones desde fuera del callback.

Por ejemplo, `agregarOperador` hace `pantalla.innerText += operador;` y si
`pantalla` no está definido globalmente el script fallará.

### Cómo arreglarlo (opciones)

1) Hacer `pantalla` global:

```js
let pantalla;
document.addEventListener('DOMContentLoaded', () => {
  pantalla = document.getElementById('pantalla');
});
```

2) Hacer que cada función obtenga el elemento cuando lo necesite:

```js
function agregarOperador(op){
  const pantalla = document.getElementById('pantalla');
  pantalla.innerText += op;
}
```

3) Mover las definiciones de las funciones dentro de `DOMContentLoaded`
   para que compartan el mismo scope que `pantalla`.

La opción 2 es la más segura y sencilla para proyectos pequeños.

## Cómo probar localmente

1) Abrir `index.html` en tu navegador (doble clic o `file://...`).
2) Para pruebas rápidas de sintaxis: desde la carpeta del proyecto
   puedes ejecutar:

```bash
node --check main.js
```

Nota: `node --check` sólo comprueba sintaxis; no ejecuta código DOM.

## Sugerencias / mejoras

- Reemplazar `eval()` por un parser de expresiones para evitar riesgos.
- Mejor manejo de decimales y validación al concatenar operadores (evitar `++` o `*-`).
- Añadir tests sencillos y/o una demo con casos de prueba (0, operaciones con decimales,
  borrar hasta vacío, manejo de errores).

---

Si quieres, aplico el arreglo 1 ó 2 automáticamente (por ejemplo, convertir
las funciones para que siempre obtengan `document.getElementById('pantalla')`),
lo hago y pruebo la sintaxis. Dime qué opción prefieres y lo implemento.
