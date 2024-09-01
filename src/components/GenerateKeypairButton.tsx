"use client";
import { SubmitButton } from ".";
import { useDefi } from "./DefiContext";

export const GenerateKeypairButton = () => {
  const { generateKeypair } = useDefi();

  return (
    <form action={generateKeypair}>
      <SubmitButton>Generate Keypair</SubmitButton>
    </form>
  );
};
