import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router";
function ZeroTours({ message }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="error">
      <div className="error__title">
        <h1 className="heading-secondary heading-secondary--error">
          Hey {user.name}!
        </h1>
      </div>
      <h1 style={{ marginTop: "10px" }} className=" text-[2rem]">
        {" "}
        {message} 🙂
      </h1>
      <div style={{ marginTop: "50px" }}>
        <button className="btn btn--green" onClick={() => navigate("/")}>
          Watch and Book Our Tours!
        </button>
      </div>
    </div>
  );
}

export default ZeroTours;
