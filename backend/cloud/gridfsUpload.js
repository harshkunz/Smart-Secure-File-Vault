const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
require('dotenv').config();

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: `${file.originalname}`,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 50 },
});

module.exports = upload;