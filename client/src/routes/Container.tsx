import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleContainers } from "../utils/handleContainers";

import Nav from "../components/Nav";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";

function Container() {
  const { containers, getContainers, changeState } = handleContainers();
  const [container, setContainer] = useState();
  const [logs, setLogs] = useState([]);
  const id = useParams();

  // Play svg
  const play = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
      <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
    </svg>
  );

  // Pause svg
  const pause = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
      <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" />
    </svg>
  );

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:2401"); //GITSPACES: wss://glorious-cod-6wj4pj674992j55-2401.app.github.dev

    ws.onopen = () => {
      console.log(`Sucessfully connected to container ws`);
      ws.send(JSON.stringify(id));
      ws.onmessage = (e) => {
        let data = e.data;
        setLogs((values: string[]) => [...values, data]);
      };
      ws.onclose = () => {
        console.log(`Connection to ${id} closed`);
      };
      window.onbeforeunload = function () {
        ws.onclose = function () {}; // disable onclose handler first
        ws.close();
      };
    };

    getContainers();
  }, []);

  return (
    <>
      <Nav />
      <main>
        <NavTop />
        <div className="widget-wrapper ">
        <div className="widget secondary row">
          {containers.length != 0 ? (
              <div className="column grow gp-1">
                <div className="row gp-1">
                  <a>
                    <b>Home</b>
                  </a>
                  <a className="muted">Config</a>
                  <a className="muted" href={`${containers[0].Id}/files`}>Files</a>
                  <a className="muted">Mods/Plugins</a>
                </div>
                <hr></hr>
                <div className="row gp-1">
                  <button
                    onClick={changeState}
                    className="circle secondary"
                    id={containers[0].Id}
                  >
                    {containers[0].State == "running" ? pause : play}
                  </button>

                  <div className="center">
                    <h5>{containers[0].Names}</h5>
                    <small className="muted">{containers[0].Image}</small>
                  </div>
                </div>
                <div className="widget column console secondary">
                  <div>
                    {logs.map((log: string, index: number) => (
                      <p key={index}>{log}</p>
                    ))}
                  </div>
                </div>
                <input id="console-input"></input>
                {/*<p>{Math.round((container.stats.memory_stats.usage / 1e+9) * 100) / 100}Gb / {Math.round((container.stats.memory_stats.limit / 1e+9) * 100) / 100}Gb</p>*/}
              </div>
            
          ) : (
            <p>Loading...</p>
          )}
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default Container;
