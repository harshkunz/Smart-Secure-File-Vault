const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileType: {
    type: String,  // e.g., 'pdf', 'jpg', 'docx'
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  encryptionStatus: {
    type: Boolean,
    default: true,  // File is encrypted by default
  },
  dateUploaded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", FileSchema);
