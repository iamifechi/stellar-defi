"use client";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useFormStatus } from "react-dom";

export interface IButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  href?: string;
  small?: boolean;
  large?: boolean;
  replace?: boolean;
  scroll?: boolean;
  outline?: boolean;
  asLink?: boolean;
}

export function Button({
  small,
  large,
  className,
  scroll = true,
  outline,
  asLink,
  ...props
}: IButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        `capitalize whitespace-nowrap flex flex-nowrap items-center place-items-center w-full text-xs md:text-sm cursor-pointer relative py-[11px] px-4 md:px-[19px] group transition-all duration-300 ease-out overflow-x-hidden min-h-[34px] border border-white/[0.06] bg-white/[0.06] focus:ring-white/[0.06] focus:ring-inset  hover:bg-white/[0.06] hover:text-white  disabled:pointer-events-none disabled:opacity-70 rounded-[5px]`,
        small ? "py-10 text-white" : "",
        outline && "text-white bg-transparent ",
        className
      )}
    >
      <span
        className={`relative w-full h-full text-center justify-center items-center gap-1 flex mx-auto text-inherit transition-all duration-300 ease-out ${
          small ? "text-xs" : ""
        }`}
      >
        {props.children}
      </span>
    </button>
  );
}

export default Button;

interface Props extends IButtonProps {
  loading?: boolean;
}

export function SubmitButton({ children, loading, ...props }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending || props.disabled || loading}
      outline={pending || loading}
      type="submit"
      id="submit"
      {...props}
      aria-disabled={pending || props.disabled || loading}
      // reverse
      className={twMerge(
        props.className,
        pending || loading
          ? "bg-transparent border border-primary cursor-wait"
          : ""
      )}
    >
      {pending || loading ? (
        <svg
          className="animate-spin motion-reduce:hidden -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
}
