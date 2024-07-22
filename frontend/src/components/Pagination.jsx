import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationComponent({ setPage, totalDocs, page }) {
  const totalPages = Math.ceil(totalDocs / 10);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant={"outline"}
            disabled={page <= 1}
            className=" text-[1.2rem] font-semibold"
            onClick={() => setPage((page) => page - 1)}
          >
            <span>
              <ChevronLeft size={16} />
            </span>
            Previous
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button
            disabled={page >= totalPages}
            variant={"outline"}
            className=" text-[1.2rem] font-semibold px-8"
            onClick={() => {
              if (page < totalPages) {
                setPage((page) => page + 1);
              }
            }}
          >
            Next{" "}
            <span>
              <ChevronRight size={16} />
            </span>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
