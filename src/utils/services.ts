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
} from "@stellar/stellar-sdk";

import { customFetch } from "./customFetch";

import {
  DEFAULT_ERROR_RESPONSE,
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
    } catch (error) {
      throw new Error(`Something went wrong funding account: ${address}.`);
    }
  }

  // Get account
  async getAccount(keypair?: Keypair) {
    try {
      if (!keypair) {
        throw new Error("Keypair is required");
      }
      const account = await this.server.getAccount(keypair.publicKey());
      return account;
    } catch (error: any) {
      throw new Error(error.message || DEFAULT_ERROR_RESPONSE);
    }
  }

  // Create Liquidity Pool
  async createLiquidityPool({
    keypair,
    assetName,
    tokenAAmount,
    tokenBAmount,
  }: {
    keypair: Keypair;
    assetName: string;
    tokenAAmount: string;
    tokenBAmount: string;
  }) {
    try {
      const account = await this.getAccount(keypair);
      const customAsset = new Asset(assetName, keypair.publicKey());
      const lpAsset = new LiquidityPoolAsset(Asset.native(), customAsset, 30);
      const lpId = getLiquidityPoolId("constant_product", lpAsset).toString(
        "hex"
      );

      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(Operation.changeTrust({ asset: lpAsset }))
        .addOperation(
          Operation.liquidityPoolDeposit({
            liquidityPoolId: lpId,
            maxAmountA: tokenAAmount,
            maxAmountB: tokenBAmount,
            minPrice: { n: 1, d: 1 },
            maxPrice: { n: 1, d: 1 },
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(keypair);
      const result = await this.server.sendTransaction(transaction);


      return {
        liquidityPoolId: lpId,
        transactionHash: result.hash,
        previewLink: `${STELLAR_TESTNET_EXPLORER_URL}/${result.hash}`,
      };
    } catch (error: any) {
      throw new Error(error?.message || DEFAULT_ERROR_RESPONSE);
    }
  }

  // Withdraw from Liquidty pool
  async withdrawFromLiquidityPool({
    keypair,
    amount,
    poolId,
  }: {
    keypair: Keypair;
    amount: string;
    poolId: string;
  }) {
    try {
      const account = await this.server.getAccount(keypair.publicKey());
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.liquidityPoolWithdraw({
            liquidityPoolId: poolId,
            amount,
            minAmountA: "0",
            minAmountB: "0",
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(keypair);
      const result = await this.server.sendTransaction(transaction);

      return {
        previewLink: `${STELLAR_TESTNET_EXPLORER_URL}/${result.hash}`,
      };
    } catch (error: any) {
      throw new Error(error?.message || DEFAULT_ERROR_RESPONSE);
    }
  }
}

// Initialize server
const stellarService = new StellarDeFiService(STELLAR_TESTNET_SERVER_URL);

export default stellarService;
