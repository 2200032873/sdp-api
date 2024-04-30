const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// Create an Express app
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Define the port to listen on
const PORT = process.env.PORT || 5000;

// MongoDB Configuration
const mongoURL = "mongodb://localhost:27017"; // MongoDB connection URL
const client = new MongoClient(mongoURL); // Create a new MongoDB client

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Define routes

// Example route for testing
app.get('/klef/test', async (req, res) => {
    res.json("Koneru Lakshmaiah Education Foundation");
});

// Example route for POST requests to /klef/cse
app.post('/klef/cse', async (req, res) => {
    res.json(req.body);
});

// REGISTRATION MODULE
app.post('/registration/signup', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const users = db.collection('users');
        const data = await users.insertOne(req.body);
        conn.close();
        res.json("Registered successfully...");
    } catch (err) {
        res.json(err).status(404);
    }
});

// LOGIN MODULE
app.post('/login/signin', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const users = db.collection('users');
        const data = await users.count(req.body);
        conn.close();
        res.json(data);
    } catch (err) {
        res.json(err).status(404);
    }
});

// HOME MODULE
app.post('/home/uname', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const users = db.collection('users');
        const data = await users.find(req.body, { projection: { firstname: true, lastname: true } }).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.json(err).status(404);
    }
});

// Example route for fetching menu items
app.post('/home/menu', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const menu = db.collection('menu');
        const data = await menu.find({}).sort({ mid: 1 }).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.json(err).status(404);
    }
});

// Example route for fetching submenu items
app.post('/home/menus', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const menus = db.collection('menus');
        const data = await menus.find(req.body).sort({ smid: 1 }).toArray();
        conn.close();
        res.json(data);
    } catch (err) {
        res.json(err).status(404);
    }
});

// CHANGE PASSWORD MODULE
app.post('/cp/updatepwd', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const users = db.collection('users');
        const data = await users.updateOne({ emailid: req.body.emailid }, { $set: { pwd: req.body.pwd } });
        conn.close();
        res.json("Password has been updated");
    } catch (err) {
        res.json(err).status(404);
    }
});

// APPOINTMENT BOOKING MODULE
app.post('/appointments/create', async (req, res) => {
    try {
        const { doctorName, patientName, appointmentTime, appointmentDate, diseaseNote } = req.body;
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const appointments = db.collection('appointments');
        const data = await appointments.insertOne({ doctorName, patientName, appointmentTime, appointmentDate, diseaseNote });
        conn.close();
        res.json("Appointment created successfully");
    } catch (err) {
        res.json(err).status(404);
    }
});

// PROFILE DETAILS MODULE
app.post('/home/profile', async (req, res) => {
    try {
        const conn = await client.connect();
        const db = conn.db('MSWD');
        const users = db.collection('users');
        const data = await users.findOne({ emailid: req.body.emailid });
        conn.close();
        res.json(data);
    } catch (err) {
        res.json(err).status(404);
    }
});

// Ensure to close the MongoDB client properly when the application exits
process.on('SIGINT', async () => {
    await client.close();
    process.exit(0);
});

