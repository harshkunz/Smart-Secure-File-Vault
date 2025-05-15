// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const app = express();
const connectToDb = require("./db/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");


// Connect to the database
connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Define routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const fileRoutes = require("./routes/files");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/files", fileRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!...');
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
