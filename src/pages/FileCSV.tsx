import React, { useEffect, useState, useRef, useCallback } from 'react';
import { parse } from 'csv-parse/browser/esm/sync';
import { RenderingManager } from '../core/RenderingManager';
import { GuiManager } from '../core/GuiManager';
import { type CSV } from '../core/SceneManager';

export const FileUpload: React.FC = () => {
  const [csvData, setCsvData] = useState<CSV | null>(null);
  const [isFirstCSVLoad, setIsFirstCSVLoad] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Referencias para mantener RenderingManager y GuiManager sin re-renderizar
  const renderingManagerRef = useRef<RenderingManager | null>(null);
  const guiManagerRef = useRef<GuiManager | null>(null);

  const checkAndLoadCsv = useCallback(async () => {
    if (!fileInputRef.current) return;

    const fileList = fileInputRef.current.files;
    let csv: CSV;

    if (!fileList || fileList.length === 0) {
      // Fetch archivo CSV por defecto
      const response = await fetch('LocPositionsTensorflow.csv');
      const text = await response.text();
      csv = parse(text, { columns: false, skip_empty_lines: true, trim: true });
    } else {
      // Procesar archivo subido
      const file = fileList[0];
      if (!file.name.endsWith('.csv')) {
        alert('Por favor, sube un archivo CSV válido.');
        return;
      }
      const text = await file.text();
      csv = parse(text, { columns: false, skip_empty_lines: true, trim: true });
    }

    removeLongestCommonPrefix(csv);

    if (guiManagerRef.current) {
      guiManagerRef.current.csvAttributes = csv[0];
      guiManagerRef.current.componentStatus = { basicMappings: true };
    }

    if (renderingManagerRef.current) {
      renderingManagerRef.current.sceneManager.csv = csv;
    }

    if (isFirstCSVLoad) {
      if (guiManagerRef.current) {
        await guiManagerRef.current.parseQuery(new URLSearchParams(window.location.search));
      }
      setIsFirstCSVLoad(false);
    }

    setCsvData(csv);
  }, [isFirstCSVLoad]);

  // Función para remover prefijo común
  const removeLongestCommonPrefix = (csv: CSV) => {
    let indexAfterPrefix = 0;

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
  };

  useEffect(() => {
    renderingManagerRef.current = new RenderingManager();
    guiManagerRef.current = new GuiManager(renderingManagerRef.current);

    checkAndLoadCsv(); // Cargar CSV por defecto al montar el componente
  }, [checkAndLoadCsv]);

  useEffect(() => {
    if (csvData && renderingManagerRef.current) {
      renderingManagerRef.current.sceneManager.csv = csvData;
      renderingManagerRef.current.requestUpdate();
    }
  }, [csvData]);

  return (
    <div id="file-upload-container">
      <p>Sube tu Dataset</p>
      <input type="file" ref={fileInputRef} onChange={checkAndLoadCsv} accept=".csv" />
    </div>
  );
};
