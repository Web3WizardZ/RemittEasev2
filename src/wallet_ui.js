const xrpl = require("xrpl");
require('dotenv').config();

async function walletOnboarding() {
    const client = new xrpl.Client(process.env.XRP_TESTNET_URL);
    await client.connect();

    // Prompt user for input: create a new wallet or connect an existing one
    const prompt = require("prompt-sync")({ sigint: true });
    const action = prompt("Do you want to create a new wallet or connect an existing one? (new/connect): ");

    let wallet;
    if (action === "new") {
        // Create a new wallet on the testnet
        wallet = (await client.fundWallet()).wallet;
        console.log("New wallet created!");
        console.log("Address: ", wallet.address);
        console.log("Secret: ", wallet.seed);
    } else if (action === "connect") {
        const address = prompt("Enter your wallet address: ");
        const secret = prompt("Enter your secret: ");
        wallet = xrpl.Wallet.fromSeed(secret);

        if (wallet.address !== address) {
            console.log("Error: The provided secret does not match the address.");
            return;
        }
        console.log("Wallet connected!");
    } else {
        console.log("Invalid action.");
        return;
    }

    // Fetch and display the balance of the wallet
    const response = await client.request({
        command: "account_info",
        account: wallet.address,
        ledger_index: "validated",
    });
    console.log("Wallet Balance: ", response.result.account_data.Balance / 1000000, "XRP");

    client.disconnect();
}

walletOnboarding().catch(console.error);
