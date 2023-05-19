// Import modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app and set up middleware
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML routes
app.get('/notes', (req, res) => {
  // Send the notes.html file when the /notes route is accessed
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/', (req, res) => {
  // Send the index.html file when the root route is accessed
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// API routes
app.get('/api/notes', (req, res) => {
  // Read the db.json file and return all saved notes as JSON
  fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Could not read note data' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  // Read the db.json file, add the new note, and save it
  fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Could not read note data' });
    }

    const notes = JSON.parse(data);
    const newNote = {
      id: generateUniqueId(),
      title: req.body.title,
      text: req.body.text,
    };

    notes.push(newNote);

    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Note did not save' });
      }
      // Send the new note as the response
      res.json(newNote);
    });
  });
});

// Generate a unique ID for the new note
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

// Delete route
app.delete('/api/notes/:id', (req, res) => {
  const dbPath = path.join(__dirname, './db/db.json');
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Could not read note data' });
    }

    const notes = JSON.parse(data);
    const noteId = req.params.id;
    // Find the index of the note with the given ID
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    // Remove the note from the array
    notes.splice(noteIndex, 1);

    fs.writeFile(dbPath, JSON.stringify(notes), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Could not delete note' });
      }

      res.status(204).send();
    });
  });
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});