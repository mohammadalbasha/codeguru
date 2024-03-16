import { useContext } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

import AuthContext from "../../store/auth-context";

function LandingPage() {
  const authCtx = useContext(AuthContext);
  const location = useLocation().pathname;

  return !authCtx.isLoggedIn ? (
    <div className=" bg-yellow-300 h-screen flex flex-col items-center justify-center">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "black",
          opacity: "50%",
          width: "420px",
          padding: "1px",
        }}
      >
        <img
          src="https://cdn-ljkdj.nitrocdn.com/DyFUWpwKxLsqrTMwFoHDscumMCBYAOfY/assets/images/optimized/rev-a23fa07/codeguru.ae/wp-content/uploads/2022/04/cg-logo.png"
          style={{ maxWidth: "800px" }}
        />
      </div>
      <Link
        className=" bg-white text-yellow-500   text-lg border-2 rounded-md mt-6 px-4 py-2"
        to={"/signin"}
      >
        {" "}
        signin
      </Link>
    </div>
  ) : (
    <Navigate to={"/expenses"} state={{ from: location }} replace />
  );
}

export default LandingPage;
