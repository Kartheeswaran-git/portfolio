const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// Firebase Admin Setup
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
let db;

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  db = admin.firestore();
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Firebase Admin initialization failed. Please ensure server/serviceAccountKey.json exists.');
  console.error(error.message);
}

const PORTFOLIO_DOC = {
  collection: 'siteContent',
  doc: 'portfolio'
};

// Read data
app.get('/api/portfolio', async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'Database not initialized' });
  }

  try {
    const docRef = db.collection(PORTFOLIO_DOC.collection).doc(PORTFOLIO_DOC.doc);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      // Return empty structure or seed data if preferred
      return res.json({ projects: [], technicalExplorations: [], skills: [], roles: [], headlines: [], links: {} });
    }
    
    res.json(doc.data());
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Write data
app.post('/api/portfolio', async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'Database not initialized' });
  }

  try {
    const newData = req.body;
    const docRef = db.collection(PORTFOLIO_DOC.collection).doc(PORTFOLIO_DOC.doc);
    
    await docRef.set({
      ...newData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    res.json({ success: true, message: 'Data saved to Firestore successfully' });
  } catch (error) {
    console.error('Error saving data to Firestore:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Simple Login (Kept as is or can be integrated with Firebase Auth if needed)
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    res.json({ success: true, token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
