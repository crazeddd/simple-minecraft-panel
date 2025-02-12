import { useNavigate } from "react-router";

import Nav from "../components/Nav";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";

function AccountSettings() {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <>
      <Nav />
      <main>
        <NavTop />
        <div>
          <button className="secondary" onClick={logOut}>
            Log out
          </button>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default AccountSettings;
