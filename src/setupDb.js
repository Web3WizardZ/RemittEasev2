const sqlite3 = require('sqlite3').verbose();

// Create and connect to the SQLite database file (customers.db)
const db = new sqlite3.Database('./customers.db');

// Create a "customers" table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            surname TEXT,
            email TEXT,
            phone TEXT,
            secretKey TEXT UNIQUE,
            walletAddress TEXT,
            balance REAL
        )
    `);

    // Insert sample data into the "customers" table
    const insertStmt = db.prepare(`
        INSERT INTO customers (name, surname, email, phone, secretKey, walletAddress, balance)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Ensure unique secret keys for each customer
    insertStmt.run('John', 'Doe', 'john.doe@example.com', '1234567890', 'sEd7PUzaApQ5oxhpGMjT3hyDyqVNqpo1', 'rExampleWalletAddress1', 500);
    insertStmt.run('Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'sEd71PhX31SSTqtXRjWoFW9YnvWZjoH1', 'rExampleWalletAddress2', 750);

    insertStmt.finalize();
});

// Close the database connection
db.close(() => {
    console.log('Database setup completed');
});
