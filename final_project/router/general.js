const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1 modified for Task 10
public_users.get('/', async (req, res) => {
  try {
    const response = await new Promise((resolve) => {
      resolve({ books });
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Task 2 modified for Task 11
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 3 modified for Task 12
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(book => book.author === author);
      if (filteredBooks.length > 0) {
        resolve({ books: filteredBooks });
      } else {
        reject(new Error("No books found for this author"));
      }
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 4 modifed for Task 13
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(book => book.title === title);
      if (filteredBooks.length > 0) {
        resolve({ books: filteredBooks });
      } else {
        reject(new Error("No books found for this title"));
      }
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 5
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json({ reviews: book.reviews });
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

// Task 6
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

module.exports.general = public_users;