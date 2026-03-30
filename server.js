const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin Setup
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Add event
app.post("/events", async (req, res) => {
  try {
    const { title } = req.body;

    const docRef = await db.collection("events").add({
      title,
      createdAt: new Date(),
    });

    res.json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all events
app.get("/events", async (req, res) => {
  try {
    const snapshot = await db.collection("events").get();

    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));