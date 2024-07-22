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
import { getTours } from "@/apis/tourApis";
import TourItem from "@/components/TourItem";
import CreateTourForm from "@/components/CreateTourForm";

function ManageTours() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [role] = useState(searchParams.get("role") || "");
  const [status] = useState(searchParams.get("status") || "");
  const serachQuery = {};

  useEffect(
    function () {
      if (page) {
        serachQuery.page = page;
      }
      if (role) {
        serachQuery.role = role;
      }
      if (status) {
        serachQuery.status = status;
      }
      setSearchParams(serachQuery);
    },
    [page, role, status]
  );
  const { data, isLoading } = useQuery({
    queryFn: () => getTours(page),
    queryKey: ["tours"],
  });

  if (isLoading) return <Spinner />;

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <div className=" flex justify-between">
          <div>
            <CardTitle className=" text-[2rem] text-green-600">
              Manage Tours
            </CardTitle>

            <CardDescription className="text-[1rem]">
              You can manage tours here.
            </CardDescription>
          </div>
          <div>
            <CreateTourForm />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="text-[1.5rem]">
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">img</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Tour id</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Rating</TableHead>
              <TableHead className="hidden md:table-cell">
                Rating Quantity
              </TableHead>
              <TableHead className="hidden md:table-cell">Difficulty</TableHead>

              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[1rem]">
            {data.tours.map((tourItem) => (
              <TourItem
                tourItem={tourItem}
                key={tourItem.id}
                totalDocs={data.totalTours}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between w-[100] ">
        <div className="text-muted-foreground text-[1.2rem]">
          Showing{" "}
          <span className=" font-semibold">
            {(page - 1) * 10 + 1}-{(page - 1) * 10 + data.tours.length}
          </span>{" "}
          of <span className="font-semibold">{data.totalTours}</span> tours
        </div>
        <div>
          {" "}
          <PaginationComponent
            setPage={setPage}
            totalDocs={data.totalTours}
            page={page}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

export default ManageTours;
