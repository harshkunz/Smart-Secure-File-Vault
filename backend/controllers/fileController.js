const File = require("../models/File");
const fs = require("fs");
const path = require("path");
const CompressionService = require("../services/compress");
const DecompressionService = require("../services/decompress");
const EncryptionService = require("../services/encrypt");
const DecryptionService = require("../services/decrypt");
const mime = require('mime-types');

// Upload File
exports.uploadFile = async (req, res) => {
  try {
    const { mimetype, size, filename, path: filePath } = req.file;

    const file = await File.create({
      userId: req.user._id,
      filename: filename,
      fileSize: size,
      fileType: mimetype.split("/")[1],
      fileUrl: filePath.replace(/\\/g, '/'),
      encryptionStatus: true,
    });

    res.status(201).json({ msg: "File uploaded", file });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all files for a user
exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id });
    res.json(files);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get/download a specific file
exports.getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Access denied or file not exist" });
    }

    res.download(path.resolve(file.fileUrl), file.filename);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete file
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Access denied or file not exist" });
    }

    fs.unlinkSync(file.fileUrl);
    await file.deleteOne();

    res.json({ msg: "File deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// prveiew file
exports.previewFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Access denied or file not exist" });
    }

    // Get file path
    const filePath = file.fileUrl;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // Get file mime type
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    // Set headers for preview
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', 'inline; filename="' + file.filename + '"');

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error("Preview error:", err);
    res.status(500).json({ message: "Error previewing file" });
  }
};


// Compress file
exports.compressFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await CompressionService.compressFile(file.fileUrl);
    if (!result.success) {
      return res.status(500).json({ msg: result.error });
    }

    // Update file record
    file.fileUrl = result.compressedPath;
    file.fileSize = result.compressedSize;
    await file.save();

    res.json({
      msg: "File compressed successfully",
      compressedSize: result.compressedSize
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Decompress file
exports.decompressFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await DecompressionService.decompressFile(file.fileUrl);
    if (!result.success) {
      return res.status(500).json({ msg: result.error });
    }

    // Update file record
    file.fileUrl = result.decompressedPath;
    file.fileSize = result.decompressedSize;
    await file.save();

    res.json({
      msg: "File decompressed successfully",
      decompressedSize: result.decompressedSize
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Encrypt file
exports.encryptFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await EncryptionService.encryptFile(file.fileUrl);
    if (!result.success) {
      return res.status(500).json({ msg: result.error });
    }

    // Update file record
    file.fileUrl = result.encryptedPath;
    file.encryptionStatus = true;
    await file.save();

    res.json({ msg: "File encrypted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Decrypt file
exports.decryptFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await DecryptionService.decryptFile(file.fileUrl);
    if (!result.success) {
      return res.status(500).json({ msg: result.error });
    }

    // Update file record
    file.fileUrl = result.decryptedPath;
    file.encryptionStatus = false;
    await file.save();

    res.json({ msg: "File decrypted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
