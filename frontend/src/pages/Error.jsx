import React from "react";
import { useNavigate } from "react-router";
function Error() {
  const navigate = useNavigate();
  return (
    <div className="error">
      <div className="error__title">
        <h2 className="heading-secondary heading-secondary--error">
          Uh oh! Something went wrong!
        </h2>
        <h2 className="error__emoji">😢 🤯</h2>
      </div>
      {/* <div className="error__msg"></div> */}
      <div style={{ marginTop: "20px" }}>
        <button
          className="btn btn--green"
          onClick={() => navigate(-1, { replace: true })}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default Error;
