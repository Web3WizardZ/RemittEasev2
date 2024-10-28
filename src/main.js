const xrpl = require("xrpl");
const { sendXRP, checkBalance } = require("./transactions");
const { addTrustline } = require("./trustline");
const { createSwapOffer } = require("./swap");
const prompt = require("prompt-sync")({ sigint: true });
require('dotenv').config();

async function main() {
    const action = prompt("What would you like to do? (send/check/trustline/swap): ");

    if (action === "send") {
        const secret = prompt("Enter your wallet secret: ");
        const wallet = xrpl.Wallet.fromSeed(secret);

        const destinationAddress = prompt("Enter the recipient's wallet address: ");
        const amount = prompt("Enter the amount of XRP to send: ");
        await sendXRP(wallet, destinationAddress, amount);

    } else if (action === "check") {
        const address = prompt("Enter your wallet address: ");
        await checkBalance(address);

    } else if (action === "trustline") {
        const secret = prompt("Enter your wallet secret: ");
        const wallet = xrpl.Wallet.fromSeed(secret);

        const currency = prompt("Enter the currency code (e.g., USD, EUR): ");
        const issuer = prompt("Enter the issuer address: ");
        await addTrustline(wallet, currency, issuer);

    } else if (action === "swap") {
        const secret = prompt("Enter your wallet secret: ");
        const wallet = xrpl.Wallet.fromSeed(secret);

        const takerGetsXRP = prompt("Enter the amount of XRP you want to offer: ");
        const takerPaysCurrency = prompt("Enter the currency you want to get (e.g., USD, EUR): ");
        const issuer = prompt("Enter the issuer address: ");
        await createSwapOffer(wallet, takerGetsXRP, takerPaysCurrency, issuer);

    } else {
        console.log("Invalid action.");
    }
}

main().catch(console.error);
