document.getElementById('withdraw-xrp').addEventListener('click', async () => {
    const walletAddress = document.getElementById('walletAddress').value;
    const amount = document.getElementById('withdrawAmount').value;

    if (!walletAddress || !amount || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid wallet address and amount.');
        return;
    }

    try {
        const response = await fetch('/api/withdraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ walletAddress, amount })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Withdrawal successful: ' + JSON.stringify(result.data));
        } else {
            alert('Withdrawal failed: ' + result.message);
        }
    } catch (error) {
        console.error('Error during withdrawal:', error);
        alert('Error during withdrawal: ' + error.message);
    }
});
