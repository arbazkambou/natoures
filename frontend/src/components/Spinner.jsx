import { RingLoader } from "react-spinners";
import "./Spinner.css";
function Spinner() {
  return (
    <div className="spinner-overlay">
      <RingLoader color="#55c57a" height={150} size={60} />
    </div>
  );
}

export default Spinner;
