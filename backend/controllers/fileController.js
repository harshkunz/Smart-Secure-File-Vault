const File = require("../models/file");
const fs = require("fs");
const path = require("path");
const CompressionService = require("../services/compress");
const DecompressionService = require("../services/decompress");
const EncryptionService = require("../services/encrypt");
const DecryptionService = require("../services/decrypt");
const mime = require('mime-types');
const mongoose = require("mongoose");
const { GridFSBucket, ObjectId } = require("mongodb");
const connectToDb = require('../db/db');


// Upload File
exports.uploadFile = async (req, res) => {
  try {
    const { filename, size, contentType, id } = req.file;

    const file = await File.create({
      userId: req.user._id,
      filename: filename,
      fileSize: size,
      fileType: contentType,
      fileUrl: id.toString(),  // GridFS file ID
      encryptionStatus: false,
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

    const db = await connectToDb();
    const bucket = new GridFSBucket(db, { bucketName: "fs" });
    const stream = bucket.openDownloadStream(new ObjectId(file.fileUrl));


    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
    stream.pipe(res);
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

    const db = await connectToDb();
    const bucket = new GridFSBucket(db, { bucketName: "fs" });

    await bucket.delete(new ObjectId(file.fileUrl));
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

    const db = await connectToDb();
    const bucket = new GridFSBucket(db, { bucketName: "fs" });
    const stream = bucket.openDownloadStream(new ObjectId(file.fileUrl));


    const mimeType = mime.lookup(file.filename) || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);

    stream.pipe(res);
  } catch (err) {
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
