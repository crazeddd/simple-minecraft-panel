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

    const url = `${apiHost}/container/create-container`;
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = res.json();
    console.log(data);

    if (res.ok) {
      navigate("/");
    }
  };

  return (
    <>
      <Nav />
      <main>
        <NavTop />
        <form className="widget secondary column" onSubmit={sumbitForm}>
          <h5>New Server</h5>
          <br />
          <div className="row gp-2">
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
            <input
              placeholder="Type"
              name="type"
              value={form.type || ""}
              onChange={handleChange}
            />
          </div>
          <br />
          <div className="row gp-2">
            <input
              placeholder="Max Ram"
              name="max_ram"
              value={form.max_ram || ""}
              onChange={handleChange}
            />
            <input
              placeholder="Max Cpu (ex. 1, 1.5)"
              name="max_cpu"
              value={form.max_cpu || ""}
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
