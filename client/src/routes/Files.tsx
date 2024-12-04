import { useEffect } from "react";
import handleFiles from "../utils/handleFiles";

import Nav from "../components/Nav";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";

function Files() {
  const { files, listDir } = handleFiles();

  useEffect(() => {
    listDir();
    const interval = setInterval(listDir, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Nav />
      <main>
        <NavTop />
        <div className="widget-wrapper">
          <div className="widget secondary row">
            <div className="column grow gp-1">
              <div className="row gp-1">
                <a className="muted" href="javascript:history.back()">
                  Home
                </a>
                <a className="muted">Config</a>
                <a>
                  <b>Files</b>
                </a>
                <a className="muted">Mods/Plugins</a>
              </div>
              <hr></hr>
              <div className="row widget secondary gp-1">
                <div className="column widget gp-3">
                  <h5>root/</h5>
                  <hr></hr>
                  {files.map((file: any, index: number) => (
                    <a className="muted" key={index}>{file}</a> 
                  ))}
                </div>
                <div className="widget column file secondary"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default Files;
