const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "john_doe", password: "password123" },
  { username: "jane_doe", password: "mypassword" }
];

let reviews = {};

const isValid = (username) => {
  return !users.some(user => user.username === username); // Username should be unique
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password); // Check credentials
};

// Task 7
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (authenticatedUser(username, password)) {
      const token = jwt.sign({ username }, 'fingerprint_customer', { expiresIn: '1h' });
      req.session.authorization = { token, username };
      return res.status(200).json({ message: "User logged in successfully", token });
    } else {
      return res.status(400).json({ message: "Invalid username or password" });
    }
  }
  return res.status(400).json({ message: "Username and password are required" });
});

// Task 8
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const review  = req.body.review;
  const username = req.body.username;

  if (!username) {
    return res.status(403).json({ message: "Unauthorized access. Please login first." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required." });
  }

  if (!reviews[isbn]) {
    reviews[isbn] = {};
  }

  if (reviews[isbn][username]) {
    reviews[isbn][username] = review;
    return res.status(200).json({ message: "Review modified successfully", reviews: reviews[isbn] });
  } else {
    reviews[isbn][username] = review;
    return res.status(200).json({ message: "Review added successfully", reviews: reviews[isbn] });
  }
});

// Task 9
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const username = req.body.username;

  if (!username) {
    return res.status(403).json({ message: "Unauthorized access. Please login first." });
  }

  if (!reviews[isbn]) {
    return res.status(404).json({ message: `No book found with ISBN ${isbn}` });
  }

  if (reviews[isbn][username]) {
    delete reviews[isbn][username];
    return res.status(200).json({ message: "Review deleted successfully", reviews: reviews[isbn] });
  } else {
    return res.status(404).json({ message: `No review found for user ${username} on ISBN ${isbn}` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;