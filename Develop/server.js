// import modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// create Express app and set up middleware
const app = express();
const PORT = process.env.PORT || 3000;

// middleware to parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML routes
app.get('/notes', (req, res) => {
  // send the notes.html file when the /notes route is accessed
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/', (req, res) => {
  // send the index.html file when the root route is accessed
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API routes
app.get('/api/notes', (req, res) => {
  // read the db.json file and return all saved notes as JSON
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Could not read note data' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  // read the db.json file and add the new note and save it
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
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

    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Note did not save' });
      }

      res.json(newNote);
    });
  });
});

// generate a unique ID for the new note
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});