// server.js
const express = require('express');
const fetch = require('node-fetch');
const bitcoin = require('bitcoinjs-lib');
const app = express();
const port = 3000;

app.use(express.json());

let balance = 0;
const privateKey = bitcoin.ECPair.makeRandom().toWIF();

app.get('/getBalance', (req, res) => {
    res.json({ balance });
});

app.post('/mine', async (req, res) => {
    try {
        // Simulate mining process
        const minedAmount = Math.random() * 5; // Simulated mined amount between 0 and 5 BTC
        balance += minedAmount;
        res.json({ success: true, minedAmount });
    } catch (error) {
        console.error('Error during mining:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/transfer', async (req, res) => {
    const { amount, destinationWallet } = req.body;

    try {
        // Simulate transfer process
        if (amount <= 0 || amount > balance) {
            res.json({ success: false, message: 'Invalid amount' });
            return;
        }

        // Sign the transaction
        const keyPair = bitcoin.ECPair.fromWIF(privateKey);
        const tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet);
        tx.addInput('dummyTransactionId', 0); // Add dummy input
        tx.addOutput(destinationWallet, amount * 100000000); // Convert BTC to Satoshi

        tx.sign(0, keyPair);

        // Broadcast the transaction (in a real-world scenario, use a proper API or SDK)
        const rawTx = tx.build().toHex();
        const blockCypherApiUrl = 'https://api.blockcypher.com/v1/btc/test3/txs/push';
        await fetch(blockCypherApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tx: rawTx }),
        });

        balance -= amount;
        res.json({ success: true, message: 'Transfer success' });
    } catch (error) {
        console.error('Error during transfer:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
