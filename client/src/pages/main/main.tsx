import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import { Outlet } from "react-router-dom";
import { Header } from "../../components/header/header";

function Main() {
  const authCtx = useContext(AuthContext);

  return (
    <div className="h-screen   ">
      <Header />

      <div
        className={`mt-24  ${authCtx.isLoggedIn ? "ml-64 max-md:ml-0" : ""}`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Main;
