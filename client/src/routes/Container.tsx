import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleContainers } from "../utils/handleContainers";

import Nav from "../components/Nav";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";

import Icons from "../../assets/Icons";

function Container() {
  const { containers, getContainers, changeState } = handleContainers();
  const [logs, setLogs] = useState([]);
  const id = useParams();

  // Svg Icons
  const { play, pause } = Icons();

  useEffect(() => {
    const ws = new WebSocket("wss://glorious-cod-6wj4pj674992j55-2401.app.github.dev"); //GITSPACES: wss://glorious-cod-6wj4pj674992j55-2401.app.github.dev

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

      window.onbeforeunload = () => {
        ws.onclose = function () { }; // disable onclose handler first
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
            {!!containers.length ? (
              <div className="column grow gp-1">
                <div className="row gp-1">
                  <a>
                    <b>Main</b>
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
                    aria-label={containers[0].State == "running" ? "Pause container" : "Start container"}
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
                <div className="row" id="console-input">
                  <p>&gt;</p>
                  <input></input>
                </div>
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
