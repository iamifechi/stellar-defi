"use client";
import { useRouter } from "next/navigation";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface IModalProps {
  heading?: string;
  children?: React.ReactNode;
  close?: () => void;
  containerClassName?: ClassNameValue;
}

export const Modal = ({
  children,
  close,
  heading,
  containerClassName,
}: IModalProps) => {
  const router = useRouter();

  const handleClose = () => {
    if (close) {
      return close();
    } else {
      router.back();
    }
  };

  return (
    <section className="fixed  animate-grow top-0 left-0 z-[999] flex flex-col items-center justify-center w-screen min-h-dvh">
      <button
        type="button"
        onClick={handleClose}
        className="fixed cursor-pointer bg-black/10 backdrop-blur-sm w-screen h-full min-h-dvh top-0 left-0 z-[10]"
      />

      <div
        // initial={{ scale: 0 }}
        // animate={{ scale: 1 }}
        // exit={{ scale: 0 }}
        // transition={{ duration: 0.3 }}
        className={twMerge(
          `w-full max-w-[MIN(90%,480px)] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  h-full min-h-[400px] max-h-[599px] overflow-hidden m-auto p-[1px] flex flex-col relative rounded-[10px] border border-[#2E2E2F] z-[20]`,
          containerClassName
        )}
      >
        <div className=" w-full m-auto bg-[#2E2E2F] flex flex-col   overflow-hidden  rounded-[10px] ">
          <header className="sticky top-0 left-0 flex items-center justify-between w-full p-6 sm:p-8 bg-inherit">
            <p>{heading}</p>
            <button onClick={handleClose} className="ml-auto" type="button">
              X
            </button>
          </header>
          <div className="relative flex flex-1 w-full max-h-full overflow-y-auto border-t border-white/[0.06] bg-inherit">
            <div className="flex flex-col flex-1 w-full h-full max-h-full gap-4 p-4 pb-4 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
