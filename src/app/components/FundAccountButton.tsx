"use client";

import stellarService from "@/utils/services";
import { SubmitButton } from ".";
import { useDefi } from "./DefiContext";
import toast from "react-hot-toast";

export const FundAccountButton = () => {
  const { fundAccount } = useDefi();

  return (
    <form action={fundAccount}>
      <SubmitButton>Fund Account</SubmitButton>
    </form>
  );
};
