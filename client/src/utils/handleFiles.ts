import { useState } from "react";

const apiHost = import.meta.env.VITE_API_HOST;

import Icons from "../../public/assets/Icons";

const handleFiles = () => {
  const { folder, default_file } = Icons();
  const [files, setFiles] = useState([]);

  const readDir = (path: string) => {
    let url = `${apiHost}/files/read-dir`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path })
    })
      .then((res) => res.json())
      .then((data: string) => {
        const parsedData: any[] = JSON.parse(data);

        parsedData.forEach((file: string, index: number) => {
          switch (file.split('.')[1]) {
            case undefined:
              parsedData[index] = [folder, file];
              return;
            default:
              parsedData[index] = [default_file, file];
              return;
          }
        })

        setFiles(parsedData);
      })
      .catch((error: Error) => console.error("Error:", error));
  };

  const readFile = (path: string) => {
    
  }

  return { files, readDir, readFile };
};

export default handleFiles;
