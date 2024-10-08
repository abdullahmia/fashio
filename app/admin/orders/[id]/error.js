"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Error() {
  return (
    <div className="">
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/assets/images/not-found.png"
          width={400}
          height={400}
          alt="error"
          className="h-[300px] w-[300px]"
        />
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-secondary">
            The page you are looking for might have been removed or is
            temporarily unavailable
          </p>
          <Link
            href="/admin/orders"
            className={`underline ${cn(
              buttonVariants({
                variant: "Link",
                padding: "lg",
              })
            )}`}
          >
            Go to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
