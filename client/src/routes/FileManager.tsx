import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";

import handleFiles from "../utils/handleFiles";

import Nav from "../components/Nav";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";

let currentDir = ""; 

function Files() {
  const { files, readDir } = handleFiles();
  const { id } = useParams();

  useEffect(() => {
    readDir("/.");
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
                <a className="muted" href={`/containers/${id}`}>
                  Main
                </a>
                <a className="muted">Config</a>
                <a>
                  <b>Files</b>
                </a>
                <a className="muted">Mods/Plugins</a>
              </div>
              <hr></hr>
              <div className="column gp-1">
                  {!!files.length ? (files.map((file: string, index: number) => (
                    <a className="row gp-3 muted" key={index} onClick={() => {currentDir += "/" + file[1], readDir(currentDir), console.log(currentDir)}}>{file}</a>
                  ))) : (
                    <p className="muted">
                      No files in location.
                    </p>
                  )}
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
