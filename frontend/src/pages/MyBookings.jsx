import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import { myBookings } from "../apis/bookingApis";
import ZeroTours from "./ZeroTours";
import Error from "./Error";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import BookingItem from "@/components/BookingItem";

function MyBookings() {
  const {
    data: bookings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: myBookings,
    queryKey: ["myBookings"],
  });

  if (isLoading) return <Spinner />;
  if (isError) return <Error error={error} />;
  if (bookings.length === 0)
    return (
      <ZeroTours message={"It seems you does not have any tour booked!"} />
    );
  return (
    <Card>
      <CardHeader>
        <CardTitle className=" text-[2rem] text-green-600">
          Your bookings
        </CardTitle>
        <CardDescription className="text-[1rem]">
          Below are your booked tours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="text-[1.5rem]">
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">img</span>
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Tour
              </TableHead>
              <TableHead className="hidden md:table-cell">User</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>

              <TableHead className="hidden md:table-cell">Rating</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[1rem]">
            {bookings.map((bookingItem) => (
              <BookingItem bookingItem={bookingItem} key={bookingItem.id} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}

export default MyBookings;
