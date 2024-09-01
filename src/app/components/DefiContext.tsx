"use client";
import stellarService from "@/utils/services";
import { Keypair } from "@stellar/stellar-sdk";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ChangeEvent,
} from "react";
import toast from "react-hot-toast";

interface DefiContextType {
  defi?: IDefi;
  setDefi: React.Dispatch<React.SetStateAction<IDefi | undefined>>;
  generateKeypair: () => Promise<void>;
  fundAccount: () => Promise<void>;
  createLiquidityPool: () => Promise<void>;
  handleDefiFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
  defiForm: {
    assetName?: string;
    tokenAAmount?: string;
    tokenBAmount?: string;
  };
}

interface IDefi {
  keypair?: Keypair;
}

const DefiContext = createContext<DefiContextType | undefined>(undefined);

export const DefiProvider = ({ children }: { children: ReactNode }) => {
  const [defi, setDefi] = useState<IDefi>();
  const [defiForm, setDefiForm] = useState({
    assetName: "",
    tokenAAmount: "",
    tokenBAmount: "",
  });

  const handleDefiFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setDefiForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate Keypair Action
  const generateKeypair = async () => {
    toast.dismiss();
    try {
      const keypair = await stellarService.generateKeypair();
      setDefi((prev) => ({
        ...prev,
        keypair,
      }));
      toast.success("Keypair generated Successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.message ||
          "Oops! There was an error generating keypair. Please try again later",
        {
          duration: 8000,
          className: "border border-red-400",
        }
      );
    }
  };

  // Fund account Action
  const fundAccount = async () => {
    toast.dismiss();
    try {
      if (!defi?.keypair) {
        throw new Error("Please generate a keypair to Fund your account");
      }
      const address = defi.keypair?.publicKey();
      const response = await stellarService.fundAccountWithFriendbot(address);
      console.log({ response });
      toast.success(`Account ${address} successfully funded.`);
    } catch (error: any) {
      toast.error(
        error?.message ||
          "Oops! There was an error generating keypair. Please try again later",
        {
          duration: 8000,
          className: "border border-red-400",
        }
      );
    }
  };

  // Create Liquidity Pool
  const createLiquidityPool = async () => {
    toast.dismiss();
    try {
      toast.success("");

      await stellarService.createTraderAccount();
    } catch (error: any) {
      toast.error(
        error?.message ||
          "An unexpected error occured. Please try again later.",
        {
          duration: 8000,
          className: "border border-red-400",
        }
      );
    }
  };

  return (
    <DefiContext.Provider
      value={{
        defi,
        setDefi,
        defiForm,
        handleDefiFormChange,
        generateKeypair,
        fundAccount,
        createLiquidityPool,
      }}
    >
      {children}
    </DefiContext.Provider>
  );
};

export const useDefi = () => {
  const context = useContext(DefiContext);
  if (context === undefined) {
    throw new Error("useDefi must be used within a DefiProvider");
  }
  return context;
};
