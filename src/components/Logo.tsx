"use client";
import Image from "next/image";
import Link from "next/link";
import { ClassNameValue, twMerge } from "tailwind-merge";

export const Logo = ({
  className,
  onClick,
}: {
  className?: ClassNameValue;
  onClick?: () => any;
}) => {
  return (
    <Link
      href="/"
      onClick={() => (onClick ? onClick() : null)}
      className={twMerge(
        `-in.dent-[9999px] text-primary relative flex items-center justify-center z-50`,
        className
      )}
    >
      Bimi
      {/* <Image
        priority
        width={185}
        height={34}
        className="object-contain w-full max-w-[128px] sm:max-w-[185px] h-full"
        src={"/images/Bimi.svg"}
        alt="Bimi logo"
      /> */}
    </Link>
  );
};
