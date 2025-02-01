import React, { useEffect, useState, useRef } from 'react';
import { parse } from 'csv-parse/browser/esm/sync';
import { RenderingManager } from '../core/RenderingManager';
import { GuiManager } from '../core/GuiManager';
import { CSV } from '../core/SceneManager';

export const FileUpload: React.FC = () => {
  const [csvData, setCsvData] = useState<CSV | null>(null);
  const [isFirstCSVLoad, setIsFirstCSVLoad] = useState(true);

  // Usamos useRef para almacenar las instancias de RenderingManager y GuiManager
  const renderingManagerRef = useRef<RenderingManager | null>(null);
  const guiManagerRef = useRef<GuiManager | null>(null);

  const checkAndLoadCsv = async () => {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    const fileList = fileUpload.files;

    let csv: CSV;
    if (fileList === null || fileList[0] === undefined) {
      csv = await parse(await (await fetch('LocPositionsTensorflow.csv')).text());
    } else {
      const file = fileList[0];
      csv = await parse(await file.text());
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
  };

  const removeLongestCommonPrefix = (csv: CSV) => {
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
  };

  useEffect(() => {
    renderingManagerRef.current = new RenderingManager();
    guiManagerRef.current = new GuiManager(renderingManagerRef.current);

    checkAndLoadCsv();
  }, []);


  useEffect(() => {
    if (csvData && renderingManagerRef.current) {
      renderingManagerRef.current.sceneManager.csv = csvData;
    }
  }, [csvData]); 
  return (
    <div id="buttons">
      <p>Sube tu Dataset</p>
      <input type="file" id="fileUpload" onChange={checkAndLoadCsv} accept=".csv" />
    </div>
  );
};
