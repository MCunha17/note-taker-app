// Import necessary modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create an Express app and set up middleware
const app = express();
const PORT = 3000;

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

// API route handler for GET /api/notes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes data' });
      return;
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// API route handler for POST /api/notes
app.post('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes data' });
      return;
    }

  const notes = JSON.parse(data);
  const newNote = req.body;
  newNote.id = generateUniqueID(); // Generate a unique ID for the new note

  notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save note' });
        return;
      }
      res.json(newNote);
    });
  });
});

// Generate a unique ID for the new note (using a simple example)
function generateUniqueID() {
  return Date.now().toString();
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});