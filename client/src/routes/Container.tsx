import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import { handleContainers } from "../utils/handleContainers";

import Nav from "../components/Nav";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";

import Icons from "../../public/assets/Icons";

function Container() {
  const { containers, getContainers, changeState } = handleContainers();
  const [container, setContainer] = useState({});
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState();

  const { id } = useParams();

  // Svg Icons
  const { play, pause } = Icons();

  useEffect(() => {
    getContainers();

    const ws: WebSocket = new WebSocket(
      "wss://glorious-cod-6wj4pj674992j55-2401.app.github.dev"
    ); //GITSPACES: wss://glorious-cod-6wj4pj674992j55-2401.app.github.dev

    ws.onopen = () => {
      console.log(`Connected to ${id}`);
      ws.send(JSON.stringify({ type: "connect", message: id }));

      ws.onmessage = (e) => {
        const { type, data } = JSON.parse(e.data);

        if (type == "log") {
          const lines = data.split(/\r?\n/).flat();
          setLogs((values: string[]) => [...values, ...lines]);
        }
        if (type == "stats") {
          setStats(data);
        }
      };

      ws.onclose = () => {
        console.log(`Connection to ${id} closed`);
      };
    };

    window.onbeforeunload = () => {
      ws.onclose = function () {}; // disable onclose handler first
      ws.close();
    };

    const sendCommand = (command: string) => {
      ws.send(JSON.stringify({ type: "command", message: command }));
    };

    const interval = setInterval(getContainers, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!!containers.length) {
      setContainer(containers.find(({ Id }: any) => Id === id));
    }
  }, [containers]);

  return (
    <>
      <Nav />
      <main>
        <NavTop />
        <div className="widget-wrapper">
          <div className="widget secondary row">
            {container ? (
              <div className="column grow gp-1">
                <div className="row gp-1">
                  <a>
                    <b>Main</b>
                  </a>
                  <a className="muted">Config</a>
                  <a className="muted" href={`${container.Id}/files`}>
                    Files
                  </a>
                  <a className="muted">Mods/Plugins</a>
                </div>
                <hr></hr>
                <div className="row gp-1">
                  <button
                    onClick={(e) => changeState(e, container.State)}
                    className="circle secondary"
                    id={container.Id}
                    aria-label={
                      container.State == "running"
                        ? "Pause container"
                        : "Start container"
                    }
                  >
                    {container.State == "running" ? pause : play}
                  </button>

                  <div className="center">
                    <h5>{container.Name}</h5>
                    <small className="muted">{container.Image}</small>
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
                {stats ? (
                  <p>
                  {Math.round((stats.memory_stats.usage / 1e9) * 100) / 100}Gb
                  / {Math.round((stats.memory_stats.limit / 1e9) * 100) / 100}
                  Gb
                </p>
                ) : (
                  <p>Loading...</p>
                )}
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
