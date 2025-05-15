const File = require("../models/File");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// Upload File
exports.uploadFile = async (req, res) => {
  try {
    const { mimetype, size, filename, path: filePath } = req.file;

    const file = await File.create({
      userId: req.user._id,
      filename: filename,
      fileSize: size,
      fileType: mimetype.split("/")[1],  // e.g., 'jpg' from 'image/jpg'
      fileUrl: filePath,
      encryptionStatus: true,  // Assuming file is encrypted on upload
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
      return res.status(403).json({ msg: "Access denied" });
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
      return res.status(403).json({ msg: "Access denied" });
    }

    fs.unlinkSync(file.fileUrl);
    await file.deleteOne();

    res.json({ msg: "File deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Encrypt file using C++ module
exports.encryptFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const encrypt = spawn("../cpp_module/encrypt", [file.fileUrl]);
    encrypt.on("close", async () => {
      file.encryptionStatus = true;
      await file.save();
      res.json({ msg: "File encrypted successfully" });
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Decrypt file using C++ module
exports.decryptFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const decrypt = spawn("../cpp_module/decrypt", [file.fileUrl]);
    decrypt.on("close", async () => {
      file.encryptionStatus = false;
      await file.save();
      res.json({ msg: "File decrypted successfully" });
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
