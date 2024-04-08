const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Files will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Generate unique filename by appending current timestamp
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer middleware
const upload = multer({ storage: storage });

// Route for uploading a single file
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// Serve static files in the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
