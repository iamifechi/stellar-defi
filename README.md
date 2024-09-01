# Stellar DeFi DApp
Personal exploration into building a basic decentralized finance (DeFi) application using the Stellar JavaScript SDK.  The goal was to gain hands-on experience with:

* Keypair generation and account management on the Stellar network.
* Creating and interacting with custom asset liquidity pools.

## Features

* Generate Stellar keypairs.
* Fund accounts using the Stellar Friendbot service.
* Create liquidity pools with custom assets.
* Withdraw assets from liquidity pools.

## Technologies Used

* **Next.js:** Frontend framework.
* **Tailwind CSS:** Styling.
* **@stellar/stellar-sdk:** Stellar network interactions.

## Running Locally

1. Clone this repository: `git clone https://github.com/iamifechi/stellar-defi.git`
2. Install dependencies: `npm install` or `yarn install`
3. Start the development server: `npm run dev` or `yarn dev`

## Live Demo

[Demo](https://stellar-defi.vercel.app)

## Code Structure

* **@src/utils/services.ts:** Contains the core Stellar network and liquidity pool logic.
* **@src/components/DefiContext.tsx:** Manages application state using React Context.
* **@src/app/page.tsx:**  Renders the main application UI. 

## Future Improvements
* **Data Persistence:** Implement a mechanism to persist user data and application state, potentially using local storage or a database.
* **Expanded Functionality:**  Explore the integration of additional Web3 features, such as:
    * Decentralized exchange (DEX) capabilities.
    * Lending and borrowing functionality.
