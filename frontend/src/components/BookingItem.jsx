import { useContext } from "react";
import { Button } from "./ui/button";
import { TableCell, TableRow } from "./ui/table";
import { AuthContext } from "@/context/AuthProvider";
import { useNavigate } from "react-router";
import { toursImages } from "@/apis/baseApiURL";

function BookingItem({ bookingItem }) {
  const { ratingsAverage, name, imageCover, price, id } = bookingItem;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <img
          alt="Product img"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={`${toursImages}/${imageCover}`}
          width="64"
          crossOrigin="anonymous"
        />
      </TableCell>
      <TableCell className="hidden md:table-cell text-center">{name}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell className="hidden md:table-cell">{price}</TableCell>

      <TableCell className="hidden md:table-cell">{ratingsAverage}</TableCell>
      <TableCell className="hidden md:table-cell">
        <Button
          className="bg-green-500 py-6 font-semibold"
          onClick={() => navigate(`/tour-detail/${id}`)}
        >
          Detail
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default BookingItem;
