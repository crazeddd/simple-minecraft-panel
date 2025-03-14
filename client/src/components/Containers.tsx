import { useEffect } from "react";

import { handleContainers } from "../utils/handleContainers";

export default function Containers() {
  const { containers, getContainers, changeState } = handleContainers();

  useEffect(() => {
    getContainers();
    const interval = setInterval(getContainers, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const loading = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
    </svg>
  );

  return (
    <div className="servers column gp-1">
      {!!containers.length ? (
        containers.map((container: any, index: number) => (
          <div className="server widget secondary row" key={index}>
            <div className="row gp-1">
              <button
                onClick={(e) => changeState(e, container.State)}
                className="circle secondary"
                id={container.Id}
              >
                {container.State == "running" ? pause : play}
              </button>
              <div className="center">
                <a href={`/containers/${container.Id}`}>
                  <h5 id="name">{container.Name}</h5>
                </a>
                <small className="muted">{container.Image}</small>
              </div>
            </div>
            <div className="center">
              <svg
                className={container.State}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
              >
                <path d="M576 0c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V32c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V128c0-17.7 14.3-32 32-32zM352 224V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V320c0-17.7 14.3-32 32-32zM96 416v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V416c0-17.7 14.3-32 32-32s32 14.3 32 32z" />
              </svg>
            </div>
          </div>
        ))
      ) : (
        <div className="server widget secondary row">
          <p className="muted">
            Its looking a bit empty in here, why not create a container?
          </p>
        </div>
      )}
    </div>
  );
}
