import { TopHeader } from "./components";
import { DefiProvider } from "./components/DefiContext";
import { GenerateKeypairButton } from "./components/GenerateKeypairButton";
import { FundAccountButton } from "./components/FundAccountButton";
import { CreateLiquidityPoolButton } from "./components/CreateLiquidityPoolButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  gap-4 p-24">
      <TopHeader />
      <DefiProvider>
        <section className="flex w-full my-4 flex-col gap-4 items-center text-center">
          <h2>
            Welcome to my Stellar Defi app. <br />
            What would you like to do?
          </h2>

          <div className="flex gap-4 brea items-center whitespace-nowrap break-all justify-center flex-wrap supports-[grid]:grid sm:grid-cols-2 my-4">
            <GenerateKeypairButton />
            <FundAccountButton />
            <CreateLiquidityPoolButton />
            <GenerateKeypairButton />
          </div>
        </section>
      </DefiProvider>
    </main>
  );
}
