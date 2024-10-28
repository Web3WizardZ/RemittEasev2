const xrpl = require("xrpl");
require('dotenv').config();

// Function to send XRP
async function sendXRP(senderWallet, destinationAddress, amount) {
    const client = new xrpl.Client(process.env.XRP_TESTNET_URL);
    await client.connect();

    // Prepare the transaction
    const preparedTx = await client.autofill({
        "TransactionType": "Payment",
        "Account": senderWallet.address,
        "Amount": xrpl.xrpToDrops(amount),  // Convert XRP amount to drops
        "Destination": destinationAddress
    });

    // Sign the transaction with the sender's wallet
    const signedTx = senderWallet.sign(preparedTx);

    // Submit the transaction
    const result = await client.submitAndWait(signedTx.tx_blob);

    // Check if the transaction was successful
    if (result.result.meta.TransactionResult === "tesSUCCESS") {
        console.log(`Transaction succeeded! ${amount} XRP sent to ${destinationAddress}`);
    } else {
        console.log(`Transaction failed: ${result.result.meta.TransactionResult}`);
    }

    client.disconnect();
}

// Function to check balance
async function checkBalance(walletAddress) {
    const client = new xrpl.Client(process.env.XRP_TESTNET_URL);
    await client.connect();

    // Request the account information
    const response = await client.request({
        command: "account_info",
        account: walletAddress,
        ledger_index: "validated"
    });

    // Display the wallet balance
    console.log("Wallet Balance: ", response.result.account_data.Balance / 1000000, "XRP");

    client.disconnect();
}

module.exports = { sendXRP, checkBalance };
