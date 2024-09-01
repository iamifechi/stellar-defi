import {
  Keypair,
  SorobanRpc,
  TransactionBuilder,
  Asset,
  Operation,
  LiquidityPoolAsset,
  getLiquidityPoolId,
  BASE_FEE,
  Networks,
  type Account,
} from "@stellar/stellar-sdk";

import { customFetch } from "./customFetch";
import {
  STELLAR_FRIEND_BOT_URL,
  STELLAR_TESTNET_EXPLORER_URL,
  STELLAR_TESTNET_SERVER_URL,
} from "./constants";

class StellarDeFiService {
  private server: SorobanRpc.Server;

  constructor(serverUrl: string) {
    this.server = new SorobanRpc.Server(serverUrl);
  }

  // Generate Keypair
  async generateKeypair() {
    return Keypair.random();
  }

  // Fund account using Friendbot
  async fundAccountWithFriendbot(address: string) {

    const friendbotUrl = `${STELLAR_FRIEND_BOT_URL}?addr=${address.trim()}`;
    try {
      return await customFetch(friendbotUrl);
      // console.log(response);
      // if (response.ok) {
      //   console.log(`Account ${address} successfully funded.`);
      //   return true;
      // } else {
      //   console.log(`Something went wrong funding account: ${address}.`);
      //   return false;
      // }
    } catch (error) {
      console.error(`Error funding account ${address}:`, error);
      throw new Error(`Something went wrong funding account: ${address}.`);
    }
  }

  // Run DeFi operations
  async runDeFiOperations() {
    // Create keypair
    const defiKeypair = Keypair.random();
    console.log("DeFi Provider Public Key:", defiKeypair.publicKey());

    // Fund account with Friendbot
    await this.fundAccountWithFriendbot(defiKeypair.publicKey());

    // Get Account
    const defiAccount = await this.server.getAccount(defiKeypair.publicKey());

    // Creating new Assets
    const ekoLanceAsset = new Asset("EkoLance", defiKeypair.publicKey());
    console.log("Custom Asset:", ekoLanceAsset);

    // Create Liquidity Pool Asset
    const liquidityPoolAsset = new LiquidityPoolAsset(
      Asset.native(),
      ekoLanceAsset,
      30
    );

    // Get Liquidity Pool ID
    const liquidityPoolId = getLiquidityPoolId(
      "constant_product",
      liquidityPoolAsset
    ).toString("hex");

    // Create a transaction
    const lpDepositTransaction = new TransactionBuilder(defiAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.changeTrust({
          asset: liquidityPoolAsset,
        })
      )
      .addOperation(
        Operation.liquidityPoolDeposit({
          liquidityPoolId,
          maxAmountA: "100",
          maxAmountB: "100",
          minPrice: { n: 1, d: 1 },
          maxPrice: { n: 1, d: 1 },
        })
      )
      .setTimeout(30)
      .build();

    lpDepositTransaction.sign(defiKeypair);
    try {
      const result = await this.server.sendTransaction(lpDepositTransaction);
      console.log(
        "Liquidity Pool Created. Transaction URL:",
        `${STELLAR_TESTNET_EXPLORER_URL}/${result.hash}`
      );
    } catch (error) {
      console.log(`Error creating Liquidity Pool: ${error}`);
      throw new Error("Error creating Liquidity Pool");
    }
  }

  // Create Trader Account
  async createTraderAccount() {
    const traderKeypair = Keypair.random();
    console.log("Trader Public Key:", traderKeypair.publicKey());

    // Fund account with Friendbot
    await this.fundAccountWithFriendbot(traderKeypair.publicKey());

    // Get Trader Account
    const traderAccount = await this.server.getAccount(
      traderKeypair.publicKey()
    );

    // Creating new Assets (must be moved to class property or method)
    const ekoLanceAsset = new Asset("EkoLance", traderKeypair.publicKey());

    // Create path payment transaction
    const pathPaymentTransaction = new TransactionBuilder(traderAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.changeTrust({
          asset: ekoLanceAsset,
          source: traderKeypair.publicKey(),
        })
      )
      .addOperation(
        Operation.pathPaymentStrictReceive({
          sendAsset: Asset.native(),
          sendMax: "1000",
          destination: traderKeypair.publicKey(),
          destAsset: ekoLanceAsset,
          destAmount: "50",
          source: traderKeypair.publicKey(),
        })
      )
      .setTimeout(30)
      .build();

    try {
      const result = await this.server.sendTransaction(pathPaymentTransaction);
      console.log(
        "Swap Performed. Transaction URL:",
        `${STELLAR_TESTNET_EXPLORER_URL}/${result.hash}`
      );
    } catch (error) {
      console.log(`Error performing swap: ${error}`);
    }
  }

  // Withdraw from Liquidty pool
  async withDrawFromLiquidityPool({
    defiAccount,
    defiKeypairs,
    liquidityPoolId,
    amount,
  }: {
    defiAccount: Account;
    defiKeypairs: Keypair[];
    liquidityPoolId: string;
    amount: string;
  }) {
    const lpWithdrawTransaction = new TransactionBuilder(defiAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.liquidityPoolWithdraw({
          liquidityPoolId,
          amount,
          minAmountA: "0",
          minAmountB: "0",
        })
      )
      .setTimeout(30)
      .build();

    lpWithdrawTransaction.sign(...defiKeypairs);

    try {
      const result = await this.server.sendTransaction(lpWithdrawTransaction);
      console.log(
        "Withdrawal Successful. Transaction URL:",
        `${STELLAR_TESTNET_EXPLORER_URL}/${result.hash}`
      );
    } catch (error) {
      console.log(`Error withdrawing from Liquidity Pool: ${error}`);
    }
  }
}

// Initialize server
const stellarService = new StellarDeFiService(STELLAR_TESTNET_SERVER_URL);

export default stellarService;
