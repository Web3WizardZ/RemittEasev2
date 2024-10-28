const xrpl = require("xrpl");
require('dotenv').config();

// Function to create a swap offer
async function createSwapOffer(wallet, takerGetsXRP, takerPaysCurrency, issuer) {
    const client = new xrpl.Client(process.env.XRP_TESTNET_URL);
    await client.connect();

    // Fetch the latest ledger index to calculate LastLedgerSequence
    const ledger = await client.request({
        command: "ledger",
        ledger_index: "validated"
    });
    const lastLedgerSequence = ledger.result.ledger_index + 20; // Add a buffer of 20 ledgers

    // Fetch account information to get the next Sequence number
    const accountInfo = await client.request({
        command: "account_info",
        account: wallet.address,
        ledger_index: "current"
    });
    const sequence = accountInfo.result.account_data.Sequence; // Get the next available Sequence

    // Fetch the recommended fee from the network
    const fee = await client.request({
        command: "fee"
    });
    const feeAmount = fee.result.drops.base_fee; // Get the base fee in drops

    // Prepare the offer creation transaction
    const offerCreateTx = {
        TransactionType: "OfferCreate",
        Account: wallet.address,
        Sequence: sequence,  // Add the correct Sequence
        TakerGets: xrpl.xrpToDrops(takerGetsXRP), // Amount of XRP to offer
        TakerPays: {
            currency: takerPaysCurrency,
            issuer: issuer,
            value: "100"  // Example: Amount of the currency to get (e.g., 100 units)
        },
        Fee: feeAmount,  // Add the transaction fee
        LastLedgerSequence: lastLedgerSequence // Include LastLedgerSequence to avoid hanging transactions
    };

    // Sign the transaction with the wallet
    const signedTx = wallet.sign(offerCreateTx);

    // Submit the offer to the decentralized exchange
    const result = await client.submitAndWait(signedTx.tx_blob);

    // Check if the transaction was successful
    if (result.result.meta.TransactionResult === "tesSUCCESS") {
        console.log(`Swap offer created: ${takerGetsXRP} XRP for 100 ${takerPaysCurrency}`);
    } else {
        console.log(`Swap offer failed: ${result.result.meta.TransactionResult}`);
    }

    client.disconnect();
}

module.exports = { createSwapOffer };
