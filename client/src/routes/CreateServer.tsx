import { useNavigate } from "react-router-dom";
import { useForm } from "../utils/useForm";

import Nav from "../components/Nav";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";

const apiHost = import.meta.env.VITE_API_HOST;

function CreateServer() {
  const { form, handleChange } = useForm();
  let navigate = useNavigate();

  const sumbitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let url = `${apiHost}/docker/build-container`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) =>
        res.json().then((data) => ({ status: res.status, body: data }))
      )
      .then((obj) => {
        console.log(obj.body);
        if (obj.status <= 200) {
          navigate("/");
        }
      });
    console.log(form);
  };

  return (
    <>
      <Nav />
      <main>
        <NavTop />
        <form className="widget secondary column" onSubmit={sumbitForm}>
          <h5>New Server</h5>
          <br />
          <div className="row">
            <input
              placeholder="Name"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
            />
            <input
              name="version"
              placeholder="Version"
              value={form.version || ""}
              onChange={handleChange}
              list="versions"
            />
            <datalist id="versions">
              <option value="1.20.4"></option>
              <option value="1.20.1"></option>
              <option value="1.20.0"></option>
              <option value="1.19.2"></option>
              <option value="1.18.1"></option>
              <option value="1.16.5"></option>
              <option value="1.20.4"></option>
              <option value="1.20.1"></option>
              <option value="1.20.0"></option>
              <option value="1.19.2"></option>
              <option value="1.18.1"></option>
              <option value="1.16.5"></option>
            </datalist>
            <img className="server-icon" src="e.png"></img>
            <input
              placeholder="Platform"
              name="platform"
              value={form.platform || ""}
              onChange={handleChange}
            />
            <input
              placeholder="Host Port"
              name="host_port"
              value={form.host_port || ""}
              onChange={handleChange}
            />
            <input
              placeholder="Protocol"
              name="protocol"
              value={form.protocol || ""}
              onChange={handleChange}
            />
          </div>
          <br />
          <input
            placeholder="Env, Ex: FOO=TRUE, BAR=FALSE"
            name="env"
            value={form.env || ""}
            onChange={handleChange}
          />
          <br />
          <button className="primary" type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                fill="var(--secondary)"
                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
              />
            </svg>
          </button>
        </form>
        <Footer />
      </main>
    </>
  );
}

export default CreateServer;
