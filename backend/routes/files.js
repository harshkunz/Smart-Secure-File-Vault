const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const fs = require("fs");
const {
  uploadFile,
  getUserFiles,
  getFile,
  deleteFile,
  compressFile,
  decompressFile,
  encryptFile,
  decryptFile,
  previewFile
} = require('../controllers/fileController');


// Ensure upload directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 100, // 100MB limit (adjust as needed)
  },
});


// File operations
router.post('/upload', auth, upload.single('file'), uploadFile);
router.get('/', auth, getUserFiles);
router.get('/:id', auth, getFile);     // download file by ID
router.get('/preview/:id', auth, previewFile); // Add this new route for preview
router.delete('/:id', auth, deleteFile);

// Compression operations
router.post('/compress/:id', auth, compressFile);
router.post('/decompress/:id', auth, decompressFile);

// Encryption operations
router.post('/encrypt/:id', auth, encryptFile);
router.post('/decrypt/:id', auth, decryptFile);

module.exports = router;
