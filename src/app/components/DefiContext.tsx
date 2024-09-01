"use client";
import { DEFAULT_ERROR_RESPONSE } from "@/utils/constants";
import stellarService from "@/utils/services";
import { Keypair } from "@stellar/stellar-sdk";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ChangeEvent,
  useEffect,
} from "react";
import toast from "react-hot-toast";

interface DefiContextType {
  defi?: IDefi;
  setDefi: React.Dispatch<React.SetStateAction<IDefi>>;
  generateKeypair: () => Promise<void>;
  fundAccount: () => Promise<void>;
  createLiquidityPool: (callback: () => void) => Promise<void>;
  withdrawFromPool: (callback: () => void) => Promise<
    | {
        previewLink: string;
      }
    | undefined
  >;
  handleDefiFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleWithdrawalFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
  defiForm: {
    assetName?: string;
    tokenAAmount?: string;
    tokenBAmount?: string;
  };
  withdrawalForm: {
    amount?: string;
    poolId?: string;
  };
}

interface IDefi {
  keypair?: Keypair;
  balance?: number | string;
  liquidityPoolId?: string;
  previewLink?: string;
}

const DefiContext = createContext<DefiContextType | undefined>(undefined);

export const DefiProvider = ({ children }: { children: ReactNode }) => {
  const [defi, setDefi] = useState<IDefi>({ balance: 0 });

  const [defiForm, setDefiForm] = useState({
    assetName: "",
    tokenAAmount: "",
    tokenBAmount: "",
  });

  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: "",
    poolId: "",
  });

  const publicKey = defi?.keypair?.publicKey();

  const getAccount = async () => {
    const account = await stellarService.getAccount(defi?.keypair);
    setDefi((prev) => ({
      ...prev,
    }));
  };

  const handleDefiFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setDefiForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWithdrawalFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setWithdrawalForm((prev) => ({
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
      if (response) {
        await getAccount();
      }
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
  const createLiquidityPool = async (callback: () => void) => {
    toast.dismiss();
    try {
      if (!defi?.keypair) {
        throw new Error("Keypair is required.");
      }

      const { liquidityPoolId, previewLink, transactionHash } =
        await stellarService.createLiquidityPool({
          keypair: defi?.keypair,
          assetName: defiForm.assetName,
          tokenAAmount: `${parseInt(defiForm.tokenAAmount)}`,
          tokenBAmount: `${parseFloat(defiForm.tokenBAmount)}`,
        });

      setDefi((prev) => ({
        ...prev,
        assetName: defiForm.assetName,
        liquidityPoolId,
        previewLink,
        transactionHash,
      }));
      toast.success("Liquidity Pool Created Successfully");
      setDefiForm({
        assetName: "",
        tokenAAmount: "",
        tokenBAmount: "",
      });
      callback();
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

  // Withdram From Liquidity Pool
  const withdrawFromPool = async (callback: () => void) => {
    toast.dismiss();
    try {
      if (!defi?.keypair) {
        throw new Error("Keypair is required.");
      }
      const response = await stellarService.withdrawFromLiquidityPool({
        keypair: defi?.keypair,
        amount: `${parseInt(withdrawalForm.amount)}`,
        poolId: withdrawalForm.poolId,
      });

      toast.success("Withdrawal successful");
      callback();
      return response;
    } catch (error: any) {
      toast.error(error?.message || DEFAULT_ERROR_RESPONSE, {
        duration: 8000,
        className: "border border-red-400",
      });
    }
  };

  useEffect(() => {
    const publicKey = defi?.keypair?.publicKey();
    if (publicKey) {
      getAccount();
    }
  }, [publicKey]);

  return (
    <DefiContext.Provider
      value={{
        defi,
        setDefi,
        defiForm,
        handleDefiFormChange,
        handleWithdrawalFormChange,
        withdrawalForm,
        withdrawFromPool,
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
