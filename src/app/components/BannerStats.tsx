"use client";
import { useDefi } from "./DefiContext";

export const BannerStats = () => {
  const { defi } = useDefi();

  return (
    <div className="border divide-y my-4 w-full  m.ax-w-[480px]">
      <div className="flex w-full text-start mx-auto p-4 supports-[grid]:grid sm:grid-cols-2">
        <div className="flex justify-start items-start flex-col gap-2">
          <p className="text-xs">Public Key:</p>
          <p>{defi?.keypair?.publicKey()}</p>
        </div>
        <div className="flex justify-start  items-start flex-col gap-2">
          <p className="text-xs">Balance:</p>
          <p>
            <span></span>
            {defi?.balance && (
              <span>{Number(defi.balance)?.toLocaleString()}</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex w-full text-start mx-auto p-4">
        <div className="flex justify-start items-start flex-col gap-2">
          <p className="text-xs">Liquidity Pool ID:</p>
          <p>
            <span>{defi?.liquidityPoolId}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
