const express = require('express');
const app = express();
const path = require('path');
const xlsx = require('xlsx');

// Serve the index.html file
app.use(express.static(path.join(__dirname, 'src')));

// API to get customer data by secret key
app.get('/getCustomerData', (req, res) => {
    const secretKey = req.query.secretKey;

    // Load the Excel file
    const workbook = xlsx.readFile(path.join(__dirname, 'src', 'Customer Data.xlsx'));
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Find the customer based on the secret key
    const customer = data.find(customer => customer['Secret Key (Seed)'] === secretKey);

    if (customer) {
        res.json(customer);
    } else {
        res.json(null); // No customer found
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
