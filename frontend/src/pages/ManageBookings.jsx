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
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { useSearchParams } from "react-router-dom";
import PaginationComponent from "@/components/Pagination";
import { getAllBookings } from "@/apis/bookingApis";
import AdminBookingItem from "@/components/AdminBookingItem";
import CreateBookingForm from "@/components/CreateBookingForm";

function ManageBookings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const serachQuery = {};

  useEffect(
    function () {
      if (page) {
        serachQuery.page = page;
      }

      setSearchParams(serachQuery);
    },
    [page]
  );
  const { data, isLoading } = useQuery({
    queryFn: () => getAllBookings(page),
    queryKey: ["bookings"],
  });

  if (isLoading) return <Spinner />;

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <div className=" flex justify-between">
          <div>
            <CardTitle className=" text-[2rem] text-green-600">
              Manage Bookings
            </CardTitle>

            <CardDescription className="text-[1rem]">
              You can manage bookings here.
            </CardDescription>
          </div>
          <div>
            <CreateBookingForm />
          </div>
        </div>
      </CardHeader>
      {data.bookings.length === 0 && (
        <CardContent>
          <CardHeader>
            It seems there is not any booking on website 🙂
          </CardHeader>
        </CardContent>
      )}
      {data.bookings.length > 0 && (
        <>
          <CardContent>
            <Table>
              <TableHeader className="text-[1.5rem]">
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">img</span>
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Tour</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">
                    BookingID
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    CreatedAt
                  </TableHead>

                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[1rem]">
                {data.bookings.map((bookingItem) => (
                  <AdminBookingItem
                    bookingItem={bookingItem}
                    key={bookingItem._id}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between w-[100] ">
            <div className="text-muted-foreground text-[1.2rem]">
              Showing{" "}
              <span className=" font-semibold">
                {(page - 1) * 10 + 1}-{(page - 1) * 10 + data.bookings.length}
              </span>{" "}
              of <span className="font-semibold">{data.totalBookings}</span>{" "}
              bookings
            </div>
            <div>
              {" "}
              <PaginationComponent
                setPage={setPage}
                totalDocs={data.totalBookings}
                page={page}
              />
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

export default ManageBookings;
