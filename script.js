// script.js
let balance = 0;

function updateBalance() {
    document.getElementById('balance').innerText = `Balance: ${balance.toFixed(2)} BTC`;
}

async function mine() {
    try {
        // Simulated mining process
        const response = await fetch('/mine', { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            balance += data.minedAmount;
            updateBalance();
            alert(`Mined ${data.minedAmount.toFixed(2)} BTC!`);
        } else {
            alert('Mining failed.');
        }
    } catch (error) {
        console.error('Error during mining:', error);
    }
}

async function transfer() {
    const amount = parseFloat(prompt('Enter the amount to transfer:'));
    if (isNaN(amount) || amount <= 0 || amount > balance) {
        alert('Invalid amount');
        return;
    }

    const destinationWallet = prompt('Enter the destination wallet address:');
    if (!destinationWallet) {
        alert('Invalid destination wallet address');
        return;
    }

    try {
        // Simulated transfer process
        const response = await fetch('/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, destinationWallet }),
        });

        const data = await response.json();

        if (data.success) {
            balance -= amount;
            updateBalance();
            alert(`Transferred ${amount.toFixed(2)} BTC to ${destinationWallet}`);
        } else {
            alert('Transfer failed.');
        }
    } catch (error) {
        console.error('Error during transfer:', error);
    }
}

// Initial update of balance when the page loads
updateBalance();
