import { useQuery } from "@tanstack/react-query";
import TourCard from "../components/TourCard";
import { getTours } from "../apis/tourApis";
import Spinner from "../components/Spinner";

function Tours() {
  const { data, isLoading } = useQuery({
    queryFn: getTours,
    queryKey: ["tours"],
  });

  if (isLoading) return <Spinner />;
  return (
    <div className="card-container" style={{ paddingTop: "2.5rem" }}>
      {data.tours.map((tour) => (
        <TourCard tour={tour} key={tour.id} />
      ))}
    </div>
  );
}

export default Tours;
