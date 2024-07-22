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
import { getAllReviews } from "@/apis/reviewApis";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

import ManageReviewItem from "../components/ManageReviewItem";
import { useSearchParams } from "react-router-dom";
import PaginationComponent from "@/components/Pagination";

function ManageReviews() {
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
    queryFn: () => getAllReviews(page),
    queryKey: ["reviews", page],
  });

  if (isLoading) return <Spinner />;

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle className=" text-[2rem] text-green-600">
          Manage Reviews
        </CardTitle>

        <CardDescription className="text-[1rem]">
          You can manage reviews here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="text-[1.5rem]">
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">img</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Tour</TableHead>
              <TableHead>Review</TableHead>
              <TableHead className="hidden md:table-cell">Rating</TableHead>
              <TableHead className="hidden md:table-cell">CreatedAt</TableHead>

              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[1rem]">
            {data.reviews.map((reviewItem) => (
              <ManageReviewItem
                reviewItem={reviewItem}
                key={reviewItem.id}
                totalReviews={data.totalReviews}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between w-[100] ">
        <div className="text-muted-foreground text-[1.2rem]">
          Showing{" "}
          <span className=" font-semibold">
            {(page - 1) * 10 + 1}-{(page - 1) * 10 + data.reviews.length}
          </span>{" "}
          of <span className="font-semibold">{data.totalReviews}</span> reviews
        </div>
        <div>
          {" "}
          <PaginationComponent
            setPage={setPage}
            totalDocs={data.totalReviews}
            page={page}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

export default ManageReviews;
