import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router";
import { saveBooking } from "../apis/bookingApis";
import Spinner from "../components/Spinner";
function SuccessPage() {
  const { userId, tourId, price } = useParams();

  const { isLoading } = useQuery({
    queryKey: ["tourBooked"],
    queryFn: () => saveBooking(userId, tourId, price),
  });
  if (isLoading) return <Spinner />;
  return (
    <div className="error">
      <div className="error__title">
        <h2 className="heading-secondary heading-secondary--error">
          Your Tour Has Been Booked!
        </h2>
        <h2 className="error__emoji">🎉🥳</h2>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button
          className="btn btn--green"
          onClick={() => (window.location.href = "/")}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;
