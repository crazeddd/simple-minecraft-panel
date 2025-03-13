import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
import { Line } from "react-chartjs-2";

import { handleContainers } from "../utils/handleContainers";

import Nav from "../components/Nav";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";

import Icons from "../../public/assets/Icons";

var cpuUsage: string[] = [];
var ramUsage: number[] = [];
var iter: string[] = [];
var i = "";

function Container() {
  const { containers, getContainers, changeState } = handleContainers();
  const [container, setContainer] = useState({});
  const [logs, setLogs] = useState([]);
  const [ramChartData, setRAMChartData] = useState();
  const [cpuChartData, setCPUChartData] = useState();

  const { id } = useParams();

  const ramChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 2.5,
        min: 0,
      },
    },
  };

  const cpuChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        min: 0,
      },
    },
  };

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
          if (iter.length > 25) {
            iter.shift();
            ramUsage.shift();
            cpuUsage.shift();
          }
          iter.push(i);

          ramUsage.push(
            Math.round((data.memory_stats.usage / 1e9) * 100) / 100
          );

          setRAMChartData({
            labels: iter,
            datasets: [
              {
                label: "RAM (Gb)",
                backgroundColor: "rgba(255, 99, 133, 0.26)",
                borderColor: "rgb(255, 99, 132)",
                fill: true,
                data: ramUsage,
              },
            ],
          });

          const cpuDelta =
            data.cpu_stats.cpu_usage.total_usage -
            data.precpu_stats.cpu_usage.total_usage;
          const systemDelta =
            data.cpu_stats.system_cpu_usage -
            data.precpu_stats.system_cpu_usage;
          const numCpus =
            data.cpu_stats.online_cpus ||
            data.cpu_stats.cpu_usage.percpu_usage.length;

          const cpuPercentage = (cpuDelta / systemDelta) * numCpus * 100;
          cpuUsage.push(cpuPercentage.toFixed(2));

          setCPUChartData({
            labels: iter,
            datasets: [
              {
                label: "CPU (%)",
                backgroundColor: "rgba(99, 255, 154, 0.26)",
                borderColor: "rgb(99, 255, 146)",
                fill: true,
                data: cpuUsage,
              },
            ],
          });
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
                  <a className="muted">Mods</a>
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
                <div>
                  {ramChartData ? (
                    <Line data={ramChartData} options={ramChartOptions} />
                  ) : (
                    <p>Loading...</p>
                  )}
                  {cpuChartData ? (
                    <Line data={cpuChartData} options={cpuChartOptions} />
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
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
