// Import necessary modules
const express = require('express');
const path = require('path');

// Create an Express app and set up middleware
const app = express();

// Middleware to parse JSON equests
app.use(express.json());

// Middleware to serve static files
app.use(express.static('public'));

// Route handler for GET /notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
  });
  
  // Route handler for other GET requests
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  

