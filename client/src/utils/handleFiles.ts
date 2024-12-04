import { useEffect, useState } from "react";

const apiHost = import.meta.env.VITE_API_HOST;

const handleFiles = () => {
  const [files, appendFiles] = useState([]);

  const listDir = () => {
    let url = `${apiHost}/files/read-dir`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => appendFiles(JSON.parse(data)))
      .catch((error) => console.error("Error:", error));
  };

  return { files, listDir };
};

export default handleFiles;
