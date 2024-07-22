import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getTour } from "../apis/tourApis";
import Spinner from "../components/Spinner";
import Tour from "../components/Tour";
import Error from "./Error";

function TourDetail() {
  const { tourId } = useParams();

  const {
    data: tour,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tour", tourId],
    queryFn: () => getTour(tourId),
    retry: false,
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error error={error} />;
  return <Tour tour={tour} />;
}

export default TourDetail;
