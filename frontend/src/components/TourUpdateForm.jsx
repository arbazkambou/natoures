import { Button } from "./ui/button";
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
import { queryClient } from "@/main";
import { useRef } from "react";
import toast from "react-hot-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import { updateTourApi } from "@/apis/tourApis";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "./ui/textarea";

export default function TourUpdateForm({ children, tourItem }) {
  const {
    name,
    price,
    startLocation,
    difficulty,
    duration,
    maxGroupSize,
    summary,
    description,
    id,
  } = tourItem;
  const buttonRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();
  const { mutate, isPending: isLoading } = useMutation({
    mutationKey: ["updateTour"],
    mutationFn: updateTourApi,
    onSuccess: () => {
      toast.success("Tour updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      queryClient.invalidateQueries({ queryKey: ["tours", id] });
      reset();
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    const formData = new FormData();

    // 1. Preparing location data
    const array = data.startCoordinates.split(",");
    const address = data.startAddress;
    const description = data.startDescription;
    const coordinates = [Number(array[1]), Number(array[0])];
    const startLocation = { description, coordinates, address, type: "Point" };
    if (
      startLocation.description &&
      startLocation.coordinates &&
      startLocation.address
    ) {
      formData.append("startLocation", JSON.stringify(startLocation));
    }

    // 2. Preparing tour images data
    const tourImg1 = data.tourImg1[0];
    const tourImg2 = data.tourImg2[0];
    const tourImg3 = data.tourImg3[0];
    const images = [tourImg1, tourImg2, tourImg3];
    images.forEach((img) => {
      if (img) {
        formData.append(`images`, img);
      }
    });

    // 3. Prepare tour dates
    const startDate1 = data.startDate1;
    const startDate2 = data.startDate2;
    const startDate3 = data.startDate3;
    const dates = [startDate1, startDate2, startDate3];
    dates.forEach((date) => {
      if (date) {
        formData.append(`startDates`, date);
      }
    });

    // 4. Preparing locations data
    const locations = [
      { description, coordinates, day: 1, type: "Point" },
      { description, coordinates, day: 2, type: "Point" },
      { description, coordinates, day: 3, type: "Point" },
    ];

    formData.append("locations", JSON.stringify(locations));

    // 5. Preparing all other general tour data
    const name = data.name;
    const duration = Number(data.duration);
    const maxGroupSize = Number(data.groupSize);
    const difficulty = data.difficulty;
    const price = Number(data.price);
    const summary = data.summary;
    const tourDescription = data.description;
    const imageCover = data.imgCover[0];
    if (name) {
      formData.append("name", name);
    }
    if (duration) {
      formData.append("duration", duration);
    }
    if (maxGroupSize) {
      formData.append("maxGroupSize", maxGroupSize);
    }
    if (difficulty) {
      formData.append("difficulty", difficulty);
    }
    if (price) {
      formData.append("price", price);
    }
    if (summary) {
      formData.append("summary", summary);
    }
    if (description) {
      formData.append("description", tourDescription);
    }
    if (imageCover) {
      formData.append("imageCover", imageCover);
    }

    mutate({ id, formData });
  }

  return (
    <Dialog className="z-50">
      <DialogTrigger asChild>
        {/* <Button className=" text-[1.2rem] px-4 py-6 font-semibold bg-green-500">
            <CirclePlus className=" mr-2" />
            New Tour
          </Button> */}
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-[2.5rem] text-center">
            Update Tour
          </DialogTitle>
          <DialogDescription className="text-[1.4rem] font-semibold text-center">
            Make changes to your tour here. Click save when you are done.
          </DialogDescription>
          <Separator className=" border-2 rounded-md border-green-500" />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between gap-x-6">
            {" "}
            <div className="grid gap-4 py-4 w-[100%]">
              {/* 1). This is start location section */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="startDescription"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Start description:
                </Label>
                <Input
                  id="startDescription"
                  className="col-span-3 py-6 text-[1.2rem]"
                  defaultValue={startLocation.description}
                  {...register("startDescription")}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="startCoordinates"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Start location:
                </Label>
                <Input
                  id="startCoordinates"
                  className="col-span-3 py-6 text-[1.2rem]"
                  defaultValue={`${startLocation.coordinates[1]},${startLocation.coordinates[0]}`}
                  {...register("startCoordinates")}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="startAddress"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Start address:
                </Label>
                <Input
                  id="startAddress"
                  className="col-span-3 py-6 text-[1.2rem]"
                  defaultValue={startLocation.address}
                  {...register("startAddress")}
                  disabled={isLoading}
                />
              </div>
              {/* 2). This is tour image section */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="tourImg1"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Tour Image1:
                </Label>
                <Input
                  id="tourImg1"
                  className="col-span-3"
                  type="file"
                  {...register("tourImg1")}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="tourImg2"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Tour Image2:
                </Label>
                <Input
                  id="tourImg2"
                  className="col-span-3"
                  type="file"
                  {...register("tourImg2")}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="tourImg3"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Tour Image3:
                </Label>
                <Input
                  id="tourImg3"
                  className="col-span-3"
                  type="file"
                  {...register("tourImg3")}
                  disabled={isLoading}
                />
              </div>

              {/* 3). This is tour date section */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="startDate1"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Start date 1:
                </Label>
                <Input
                  id="startDescription"
                  className="col-span-3"
                  type="date"
                  {...register("startDate1")}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="startDate2"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Start date 2:
                </Label>
                <Input
                  id="startDate2"
                  className="col-span-3"
                  type="date"
                  {...register("startDate2")}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="startDate3"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Start date 3:
                </Label>
                <Input
                  id="startDate3"
                  className="col-span-3 py-6 text-[1.2rem]"
                  type="date"
                  {...register("startDate3")}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid gap-4 py-4 w-[100%]">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="name"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Name:
                </Label>
                <Input
                  id="name"
                  className="col-span-3 py-6 text-[1.2rem]"
                  defaultValue={name}
                  {...register("name")}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="duration"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Duration:
                </Label>
                <Input
                  id="duration"
                  className="col-span-3 py-6 text-[1.2rem]"
                  defaultValue={duration}
                  type="number"
                  {...register("duration")}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="groupSize"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Group size:
                </Label>
                <Input
                  id="groupSize"
                  className="col-span-3 py-6 text-[1.2rem]"
                  type="number"
                  defaultValue={maxGroupSize}
                  min={5}
                  max={25}
                  {...register("groupSize")}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="difficulty"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Difficulty:
                </Label>
                <Input
                  id="difficulty"
                  className="col-span-3 py-6 text-[1.2rem]"
                  defaultValue={difficulty}
                  {...register("difficulty")}
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
                  defaultValue={price}
                  type="number"
                  min={5}
                  {...register("price")}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="summary"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Summary:
                </Label>
                <Input
                  id="summary"
                  className="col-span-3 py-6 text-[1.2rem]"
                  defaultValue={summary}
                  {...register("summary")}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="description"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Description:
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3 py-6 text-[1.2rem]"
                  defaultValue={description}
                  {...register("description")}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="imgCover"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Cover image:
                </Label>
                <Input
                  id="imgCover"
                  className="col-span-3"
                  type="file"
                  {...register("imgCover")}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="px-8 py-7 mt-4 text-[1.2rem] w-[100%]"
          >
            {isLoading ? "Updating..." : "Update"}
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
