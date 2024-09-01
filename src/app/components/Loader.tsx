import { ClassNameValue, twMerge } from "tailwind-merge";
import { LoadingAnimation } from "./loadingAnimation/LoadingAnimation";

export const Loader = ({ className }: { className?: ClassNameValue }) => {
  return (
    <section
      className={twMerge(
        `p-[MIN(100px,10%)] absolute top-0 left-0 min-h-screen z-[100] w-full flex items-center justify-center bg-inherit`,
        className
      )}
    >
      <LoadingAnimation />
    </section>
  );
};
