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
import { queryClient } from "@/main";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteUserApi, updateUserApi } from "@/apis/userApis";

function UserItem({ userItem }) {
  const { imagePath, name, email, id, status, role } = userItem;
  const [userStatus, setUserStatus] = useState("");
  const [userRole, setUserRole] = useState("");
  const buttonRef = useRef(null);
  const { register, handleSubmit } = useForm();
  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User has been deleted!");
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("User has been updated!");
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    },
    onError: (err) => toast.error(err.message),
  });
  function onSubmit(data) {
    // data.rating = Number(data.rating);
    // updateReview({ id, data });
    // reset();
    data.role = userRole;
    data.status = userStatus;
    updateUser({ data, id });
  }
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <img
          alt="Product img"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={imagePath}
          width="64"
          crossOrigin="anonymous"
        />
      </TableCell>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell className="hidden md:table-cell">{id}</TableCell>
      {/* 
      <TableCell className="hidden md:table-cell">
        {formatDate(parseISO(createdAt), "yyyy-MM-dd hh:mm a")}
      </TableCell> */}
      <TableCell className="hidden md:table-cell">{role}</TableCell>
      <TableCell className="hidden md:table-cell">{status}</TableCell>

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
                  htmlFor="name"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Name:
                </Label>
                <Input
                  id="name"
                  className="col-span-3 py-6 text-[1.2rem]"
                  defaultValue={name}
                  required
                  {...register("name")}
                  disabled={isUpdating}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="email"
                  className="text-center text-[1.4rem] font-semibold"
                >
                  Email:
                </Label>
                <Input
                  id="email"
                  className="col-span-3 py-6 text-[1.2rem]"
                  defaultValue={email}
                  required
                  {...register("email")}
                  disabled={isUpdating}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-center text-[1.4rem] font-semibold">
                  Status:
                </Label>

                <Select
                  className="col-span-3 py-6 text-[1.2rem]"
                  value={userStatus}
                  onValueChange={(e) => setUserStatus(e)}
                >
                  <SelectTrigger className="w-[180px] font-semibold tex-[2rem]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="block">Block</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-center text-[1.4rem] font-semibold">
                  Role:
                </Label>
                <Select
                  className="col-span-3 py-6 text-[1.2rem]"
                  value={userRole}
                  onValueChange={(e) => setUserRole(e)}
                >
                  <SelectTrigger className="w-[180px] font-semibold tex-[2rem]">
                    <SelectValue placeholder="Change role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="lead-guide">Lead guide</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                <DropdownMenuItem onClick={() => deleteUser(id)}>
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

export default UserItem;
