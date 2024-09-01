"use client";
// import { Eye, EyeSlash } from "iconsax-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface IInput
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

interface ITextArea
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {}

type InputProps = ITextArea & IInput;

interface IInputProps extends InputProps {
  isTextArea?: boolean;
  label?: string;
  error?: string;
  touched?: boolean;
  containerStyle?: string;
  inputStyle?: string;
  labelStyle?: string;
  children?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = ({
  isTextArea,
  label,
  error,
  touched,
  className,
  containerStyle,
  labelStyle,
  inputStyle,
  children,
  rightIcon,
  ...props
}: IInputProps) => {
  return (
    <div
      className={twMerge(
        `bg-inherit w-full flex flex-col gap-1`,
        containerStyle
      )}
    >
      {label && (
        <label
          htmlFor={props.name}
          className={twMerge(
            `flex capitalize items-center text-sm font-medium labelStyle`,
            labelStyle
          )}
        >
          {label}
          {props.required && <>*</>}
        </label>
      )}

      <div
        className={twMerge(
          `relative border border-white/[0.06] rounded flex-1 w-full justify-start flex items-center`,
          error
            ? "text-red-600 border-red-600/[0.06]"
            : "border-[#D1D1D1]/[0.06]",
          className
        )}
      >
        <>{children}</>
        <input
          {...props}
          className={twMerge(
            `p-[12px] focus:ring-1 bg-[#232324]  px-3 text-sm rounded w-full placeholder:font-body`,
            inputStyle
          )}
        />
        {rightIcon && (
          <span
            className={`absolute text-sm right-3 top-[50%] -translate-y-[50%] px-2`}
          >
            {" "}
            {rightIcon}{" "}
          </span>
        )}
      </div>

      {error && (
        <span className="my-1 text-xs text-red-700 break-words max-w-fit">
          {error}
        </span>
      )}
      {/* </div> */}
    </div>
  );
};
