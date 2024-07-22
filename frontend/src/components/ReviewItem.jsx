import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { TableCell, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { deleteReviewApi, updateReviewApi } from "@/apis/reviewApis";
import { queryClient } from "@/main";
import { useContext, useRef } from "react";
import { AuthContext } from "@/context/AuthProvider";
import toast from "react-hot-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import { formatDate, parseISO } from "date-fns";

function ReviewItem({ reviewItem }) {
  const { review, createdAt, tour, rating, id } = reviewItem;
  const buttonRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();
  const { user } = useContext(AuthContext);
  const { mutate: deleteReview, isPending: isDeleting } = useMutation({
    mutationFn: deleteReviewApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", user.id] });
      toast.success("Review has been deleted!");
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateReview, isPending: isUpdating } = useMutation({
    mutationFn: updateReviewApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", user.id] });
      toast.success("Review has been updated!");
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    },
    onError: (err) => toast.error(err.message),
  });
  function onSubmit(data) {
    data.rating = Number(data.rating);
    updateReview({ id, data });
    reset();
  }
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <img
          alt="Product img"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={tour.imageCoverPath}
          width="64"
          crossOrigin="anonymous"
        />
      </TableCell>
      <TableCell className="font-medium">{review}</TableCell>
      <TableCell>{tour.name}</TableCell>
      <TableCell className="hidden md:table-cell">{rating}</TableCell>

      <TableCell className="hidden md:table-cell">
        {formatDate(parseISO(createdAt), "yyyy-MM-dd hh:mm a")}
      </TableCell>

      <Dialog>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-[2.5rem] text-center">
              Edit Review
            </DialogTitle>
            <DialogDescription className="text-[1.4rem] font-semibold">
              Make changes to your review here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="review"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Review:
                </Label>
                <Input
                  id="review"
                  className="col-span-3 py-6 text-[1.2rem]"
                  defaultValue={review}
                  required
                  {...register("review")}
                  disabled={isUpdating}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="rating"
                  className="text-center  text-[1.4rem] font-semibold"
                >
                  Rating:
                </Label>
                <Input
                  id="rating"
                  type="number"
                  placeholder="Give rating between 1 and 5"
                  className="col-span-3 py-6 text-[1.2rem]"
                  defaultValue={rating}
                  min={1}
                  max={5}
                  step={0.1}
                  disabled={isUpdating}
                  required
                  {...register("rating")}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="px-8 py-7 mt-4 text-[1.2rem] w-[100%]"
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </form>
          <DialogClose asChild>
            <Button
              type="submit"
              variant="outline"
              className="px-8 py-7  text-[1.2rem] w-[100%] font-semibold"
              ref={buttonRef}
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogContent>
        <TableCell>
          {isDeleting || isUpdating ? (
            <span className={` text-[1.5rem] font-semibold text-green-500`}>
              {isDeleting ? " Deleting..." : " Updating..."}
            </span>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DialogTrigger asChild>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem onClick={() => deleteReview(id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TableCell>
      </Dialog>
    </TableRow>
  );
}

export default ReviewItem;
