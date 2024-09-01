import { TopHeader } from "../components";
import { DefiProvider } from "../components/DefiContext";
import { GenerateKeypairButton } from "../components/GenerateKeypairButton";
import { FundAccountButton } from "../components/FundAccountButton";
import { CreateLiquidityPool } from "../components/CreateLiquidityPool";
import { BannerStats } from "../components/BannerStats";
import { WithdrawFromPool } from "../components/WithdrawFromPool";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  gap-4 p-12 sm:p-24 min-w-[320px]">
      <TopHeader />
      <DefiProvider>
        <section className="flex w-full my-4 flex-col gap-4 items-center text-center">
          <h2>
            Welcome to my Stellar Defi app. <br />
            What would you like to do?
          </h2>
          <BannerStats />

          <div className="flex gap-4 brea items-center whitespace-nowrap break-all justify-center flex-wrap supports-[grid]:grid sm:grid-cols-2 my-4">
            <GenerateKeypairButton />
            <FundAccountButton />
            <CreateLiquidityPool />
            <WithdrawFromPool />
          </div>
        </section>
      </DefiProvider>
    </main>
  );
}
