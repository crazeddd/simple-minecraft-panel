import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleContainers } from "../utils/handleContainers";

import Nav from "../components/Nav";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";

const apiHost = import.meta.env.VITE_API_HOST;

function Container() {
  const { changeState } = handleContainers();
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

  const getContainer = (id: any) => {
    let url = `${apiHost}/container/get-container`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    })
      .then((res) => res.json())
      .then((data) => setContainer(JSON.parse(data)))
      .catch((error) => console.error("Error:", error));
  };

  /*document.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
      console.log("e");
    }
  });*/

  useEffect(() => {
    getContainer(id);

    container;

    const ws = new WebSocket("wss://glorious-cod-6wj4pj674992j55-2401.app.github.dev");

    ws.onopen = () => {
      ws.send(JSON.stringify(id));
      ws.onmessage = (e) => {
        let data = e.data;
        setLogs((values: string[]) => ([...values, data]));
      }
      ws.onclose = () => {
        console.log(`Connection to ${id} closed`);
      }
      window.onbeforeunload = function () {
        ws.onclose = function () { }; // disable onclose handler first
        ws.close();
      };
    }
  }, []);

  return (
    <>
      <Nav />
      <main>
        <NavTop />
        <div className="widget-wrapper">
          <div className="widget secondary row">
            {container ? (
              <div className="column grow gp-1">
                <div className="row">
                  <button
                    onClick={changeState}
                    className="circle secondary"
                    id={container.info.Id}
                  >
                    {container.info.State.Status == "running" ? pause : play}
                  </button>

                  <div className="center">
                    <h5>{container.info.Name}</h5>
                    <small className="muted">{container.info.Image}</small>
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
                <p>{Math.round((container.stats.memory_stats.usage / 1e+9) * 100) / 100}Gb / {Math.round((container.stats.memory_stats.limit / 1e+9) * 100) / 100}Gb</p>
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