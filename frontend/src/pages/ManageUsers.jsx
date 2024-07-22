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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/apis/userApis";
import UserItem from "@/components/UserItem";
import Spinner from "@/components/Spinner";
import PaginationComponent from "@/components/Pagination";
import { useSearchParams } from "react-router-dom";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";

function ManageUsers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");

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
    queryFn: () => getAllUsers(page, role, status),

    queryKey: ["users", page, role, status],
  });

  if (isLoading) return <Spinner />;
  //   if (data.users?.length === 0)
  //     return <ZeroTours message={"It seems there is not any registerd user!"} />;
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <div className=" flex justify-between">
          <CardTitle className=" text-[2rem] text-green-600">
            Manage Users
          </CardTitle>

          <div className=" flex gap-x-5">
            {" "}
            <div className=" flex justify-center gap-x-2">
              <Label className=" font-semibold mt-1">Status:</Label>
              <Select onValueChange={(value) => setStatus(value)}>
                <SelectTrigger className="w-[180px] font-semibold tex-[2rem]">
                  <SelectValue placeholder={status ? status : "All"} />
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
            <div className=" flex justify-center gap-x-2">
              <Label className=" font-semibold mt-1">Role:</Label>
              <Select onValueChange={(e) => setRole(e)}>
                <SelectTrigger className="w-[180px] font-semibold tex-[2rem]">
                  <SelectValue placeholder={role ? role : "All"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="lead-guide">Lead Guide</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

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
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Id</TableHead>

              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[1rem]">
            {data.users.map((userItem) => (
              <UserItem
                userItem={userItem}
                key={userItem.id}
                setPage={setPage}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between w-[100] ">
        <div className="text-muted-foreground text-[1.2rem]">
          Showing{" "}
          <span className=" font-semibold">
            {(page - 1) * 10 + 1}-{(page - 1) * 10 + data.users.length}
          </span>{" "}
          of <span className="font-semibold">{data.totalUsers}</span> users
        </div>
        <div>
          {" "}
          <PaginationComponent
            setPage={setPage}
            totalDocs={data.totalUsers}
            page={page}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

export default ManageUsers;
