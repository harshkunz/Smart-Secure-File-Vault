const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require("../cloud/gridfsUpload");
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
