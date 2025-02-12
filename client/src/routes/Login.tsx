import { useNavigate } from "react-router-dom";
import { useForm } from "../utils/useForm";

const apiHost = import.meta.env.VITE_API_HOST;

export default function Login() {
  const { form, handleChange } = useForm();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `${apiHost}/users/login`;
    try {
      const res = fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await (await res).json();

      JSON.stringify(console.log(data.message));

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (error: unknown) {
      console.error("Unexpected error when fetching", error);
    }
  };

  return (
    <form className="auth-form column gp-1" onSubmit={handleSubmit}>
      <h4>Login</h4>
      <hr></hr>
      <div className="column gp-2">
        <input
          name="username"
          placeholder="Username"
          value={form.username || ""}
          onChange={handleChange}
        ></input>
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password || ""}
          onChange={handleChange}
        ></input>
        <button className="primary" type="submit">
          Continue
        </button>
      </div>
      <small className="muted">Dont have an account?</small>
    </form>
  );
}