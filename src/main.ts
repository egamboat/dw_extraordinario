import {parse} from 'csv-parse/browser/esm/sync';
import {RenderingManager} from './core/RenderingManager.ts';
import {GuiManager} from './core/GuiManager.ts';
import {type CSV} from './core/SceneManager.ts';

const renderingManager = new RenderingManager();
const guiManager = new GuiManager(renderingManager);

await loadCsvFromLocalStorage();
async function loadCsvFromLocalStorage() {
	const csvUrl = localStorage.getItem("csv_url");
	if (!csvUrl) {
	  console.error("No se encontró 'csv_url' en localStorage. Asegúrate de abrir app.html desde tu app React.");
	  return;
	}
  
	// 2. Hacer fetch de la URL para obtener el CSV
	let response;
	try {
	  response = await fetch(csvUrl);
	} catch (error) {
	  console.error("Error realizando fetch al CSV:", error);
	  return;
	}
  
	if (!response.ok) {
	  console.error("No se pudo obtener el CSV. Código HTTP:", response.status);
	  return;
	}
  
	const text = await response.text();
  
	// 3. Parsear el CSV
	const csv = parse(text);
  
	// 4. Ajuste opcional de columnas (tu función removeLongestCommonPrefix)
	removeLongestCommonPrefix(csv);
  
	// 5. Configurar tu GUI y la escena
	guiManager.csvAttributes = csv[0];
	guiManager.componentStatus = { basicMappings: true };
	renderingManager.sceneManager.csv = csv;
  
	// (Opcional) Si quieres procesar query params solo una vez (similar a "isFirstCSVLoad"),
	// lo puedes hacer aquí, si lo necesitas.
	// Ejemplo:
	await guiManager.parseQuery(new URLSearchParams(window.location.search));
  }
function removeLongestCommonPrefix(csv: CSV) {
	let indexAfterPrefix = 0;

	// First line contains column names
	outerLoop:
	for (let charIndex = 0; charIndex < csv[1][0].length; ++charIndex) {
		for (let line = 2; line < csv.length; ++line) {
			if (csv[line][0][charIndex] !== csv[1][0][charIndex] && !csv[line][0].includes('___Landmark')) {
				break outerLoop;
			}
		}

		++indexAfterPrefix;
	}

	for (let line = 1; line < csv.length; ++line) {
		if (csv[line][0].includes('___Landmark')) return;
		csv[line][0] = csv[line][0].substring(indexAfterPrefix);
	}
}