const xrpl = require("xrpl");
require("dotenv").config();  // Load environment variables from .env

async function createWallet() {
    const client = new xrpl.Client(process.env.XRP_TESTNET_URL);
    await client.connect();

    // Create a new wallet on the testnet
    const wallet = (await client.fundWallet()).wallet;
    console.log("New wallet created: ", wallet.address);
    console.log("Secret: ", wallet.seed);

    client.disconnect();
}

createWallet().catch(console.error);
