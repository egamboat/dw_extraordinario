# Uso
Para clonar este repositorio localmente y ejecutar `npm install --legacy-peer-deps`, se instalarán todos los elementos necesarios mediante [npm](https://www.npmjs.com/).
Cuando todas las dependencias se hayan instalado correctamente, puede ejecutar `npm run build` para compilar el software o `npm run dev` para ejecutarlo en modo de desarrollo.
A continuación, ejecute `npm run preview` para alojar un servidor al que pueda acceder mediante un navegador web.

Al principio, el prototipo siempre carga un conjunto de datos predefinido.
Con el botón de la parte superior izquierda, puede seleccionar sus propios conjuntos de datos para visualización. Estos conjuntos de datos deben estar en formato CSV y
contener solo datos numéricos, mientras que la primera columna debe llamarse `Documento` y se interpretará como una cadena de identificadores. \
Usando la GUI en el lado derecho de la pantalla, seleccione un atlas de glifos y una asignación para `posición x`, `posición y` y `Tipo de glifo`.
Una vez hecho esto, deberían aparecer los glifos. \
Puede navegar en el plano de visualización usando un mouse, un panel táctil o una pantalla táctil.

## Dependencias
- [csv-parse](https://www.npmjs.com/package/csv-parse) para analizar conjuntos de datos de entrada
- [lil-gui](https://lil-gui.georgealways.com/) para proporcionar una GUI para cambiar los parámetros de visualización
- [three.js](https://threejs.org/) para renderizar y administrar la escena 3D
- [three-openll-labels](https://strawberriesandcheese.github.io/three-openll-labels/) para renderizar información detallada a pedido para cada glifo
- [threejs-world-in-hand](https://orbitnavjs.github.io/WIHNavigationWebsite/) para navegar en el plano de visualización