const xrpl = require("xrpl");
require('dotenv').config();

// Function to create a trustline to a specific currency issuer
async function addTrustline(wallet, currency, issuer) {
    const client = new xrpl.Client(process.env.XRP_TESTNET_URL);
    await client.connect();

    // Prepare the trustline transaction
    const trustSetTx = {
        TransactionType: "TrustSet",
        Account: wallet.address,
        LimitAmount: {
            currency: currency,
            issuer: issuer,
            value: "1000000000" // Trustline limit (e.g., 1 billion units)
        }
    };

    // Sign the transaction with the wallet
    const signedTx = wallet.sign(trustSetTx);

    // Submit the trustline transaction
    const result = await client.submitAndWait(signedTx.tx_blob);

    // Check if the transaction was successful
    if (result.result.meta.TransactionResult === "tesSUCCESS") {
        console.log(`Trustline created for ${currency} from issuer ${issuer}`);
    } else {
        console.log(`Trustline failed: ${result.result.meta.TransactionResult}`);
    }

    client.disconnect();
}

module.exports = { addTrustline };
