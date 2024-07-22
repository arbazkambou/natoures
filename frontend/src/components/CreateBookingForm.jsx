import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";
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
import { useRef } from "react";
import toast from "react-hot-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { queryClient } from "@/main";
import { createBookingApi } from "@/apis/bookingApis";

export default function CreateBookingForm() {
  const buttonRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();
  const { mutate: createBooking, isPending: isLoading } = useMutation({
    mutationKey: ["createBooking"],
    mutationFn: createBookingApi,
    onSuccess: () => {
      toast.success("Booking created successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      reset();
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    createBooking(data);
  }

  return (
    <Dialog className="z-50">
      <DialogTrigger asChild>
        <Button className=" text-[1.2rem] px-4 py-6 font-semibold bg-green-500">
          <CirclePlus className=" mr-2" />
          New Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-[2.5rem] text-center">
            Create New Booking
          </DialogTitle>
          <DialogDescription className="text-[1.4rem] font-semibold text-center">
            Make changes to your booking here. Click save when you are done.
          </DialogDescription>
          <Separator className=" border-2 rounded-md border-green-500" />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4 w-[100%]">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="tourID"
                className="text-center text-[1.4rem] font-semibold"
              >
                TourID:
              </Label>
              <Input
                id="tourID"
                className="col-span-3 py-6 text-[1.2rem]"
                {...register("tour", { required: true })}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="userID"
                className="text-center text-[1.4rem] font-semibold"
              >
                UserID:
              </Label>
              <Input
                id="userID"
                className="col-span-3 py-6 text-[1.2rem]"
                {...register("user", { required: true })}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="price"
                className="text-center text-[1.4rem] font-semibold"
              >
                Price:
              </Label>
              <Input
                id="price"
                className="col-span-3 py-6 text-[1.2rem]"
                required
                {...register("price", { required: true })}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="px-8 py-7 mt-4 text-[1.2rem] w-[100%]"
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </form>
        <DialogClose asChild>
          <Button
            variant="outline"
            className="px-8 py-7  text-[1.2rem] w-[100%] font-semibold"
            ref={buttonRef}
          >
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
