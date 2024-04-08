const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mydatabase'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Parse JSON bodies
app.use(bodyParser.json());

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
          console.error('JWT verification error:', err);
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }
      req.email = decoded.email;
      next();
  });
};

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.length === 0) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }
      const user = result[0];
      try {
        if (await bcrypt.compare(password, user.password)) {
          const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.json({ accessToken });
        } else {
          res.status(401).json({ error: 'Invalid username or password' });
        }
      } catch {
        res.status(500).send();
      }
    });
  });

// Validation middleware for POST /users route
const validateUser = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Invalid email'),
  check('password').notEmpty().withMessage('Password is required')
  .isLength({ min: 6, max: 11 })
  .withMessage('Password must be between 6 and 11 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


// Create a new user
app.post('/users', authenticateJWT, validateUser, (req, res) => {
  // If the middleware chain reaches this point, it means the request data has passed validation
  // Extract user data from validated request body
  const { name, email, password } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: "Failed to hash password" });
    }

    // Insert user into the database
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'User created successfully' });
    });
  });
});

// Get all users
app.get('/users', authenticateJWT, (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

// Update a user
app.put('/users/:id', authenticateJWT, (req, res) => {
  const { name, email } = req.body;
  const userId = req.params.id;
  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(sql, [name, email, userId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.send('User updated successfully');
  });
});

// Delete a user
app.delete('/users/:id', authenticateJWT, (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      // No rows were affected, indicating that the user ID was not found
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.send('User deleted successfully');
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
