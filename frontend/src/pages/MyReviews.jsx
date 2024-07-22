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
import { getAllUserReviews } from "@/apis/reviewApis";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import ZeroTours from "@/pages/ZeroTours";
import Spinner from "@/components/Spinner";
import ReviewItem from "@/components/ReviewItem";

function MyReviews() {
  const { user } = useContext(AuthContext);
  const { data: reviews, isLoading } = useQuery({
    queryFn: () => getAllUserReviews(user.id),
    queryKey: ["reviews", user.id],
  });

  if (isLoading) return <Spinner />;
  if (reviews?.length === 0)
    return <ZeroTours message={"It seems you have not reviewd any tour!"} />;
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
              <TableHead>Review</TableHead>
              <TableHead>Tour</TableHead>
              <TableHead className="hidden md:table-cell">Rating</TableHead>

              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[1rem]">
            {reviews.map((reviewItem) => (
              <ReviewItem reviewItem={reviewItem} key={reviewItem.id} />
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

export default MyReviews;
