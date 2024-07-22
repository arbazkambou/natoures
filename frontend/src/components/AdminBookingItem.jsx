import { Button } from "./ui/button";
import { TableCell, TableRow } from "./ui/table";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/main";
import { deleteBookingApi } from "@/apis/bookingApis";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { formatDate, parseISO } from "date-fns";
import { usersImages } from "@/apis/baseApiURL";

function AdminBookingItem({ bookingItem }) {
  const { tour, user: bookedUser, price, _id: id, createdAt } = bookingItem;
  const { user } = useContext(AuthContext);
  const { mutate: deleteBooking, isPending } = useMutation({
    mutationFn: deleteBookingApi,
    onSuccess: () => {
      toast.success("Booking has been deleted!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["tour", user.id] });
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <img
          alt="Product img"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={`${usersImages}/${bookedUser.photo}`}
          width="64"
          crossOrigin="anonymous"
        />
      </TableCell>
      <TableCell className="hidden md:table-cell">{bookedUser.name}</TableCell>
      <TableCell>{tour.name}</TableCell>
      <TableCell className="hidden md:table-cell">{price}</TableCell>
      <TableCell className="hidden md:table-cell">{id}</TableCell>

      <TableCell className="hidden md:table-cell">
        {formatDate(parseISO(createdAt), "yyyy-MM-dd hh:mm a")}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Button
          variant="destructive"
          className=" text-[1rem] px-4 py-6 font-semibold"
          onClick={() => deleteBooking(id)}
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default AdminBookingItem;
