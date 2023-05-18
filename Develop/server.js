// Import necessary modules
const express = require('express');
const path = require('path');

// Create an Express app and set up middleware
const app = express();

// Middleware to parse JSON equests
app.use(express.json());

// Middleware to serve static files
app.use(express.static('public'));



