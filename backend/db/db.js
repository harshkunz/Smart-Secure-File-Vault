const mongoose = require('mongoose');

let db = null;

async function connectToDb() {
  if (db) return db;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    db = conn.connection.db;
    return db;
  } catch (err) {
    console.error('Database connection error:', err.message);
    throw err;
  }
}

module.exports = connectToDb;
