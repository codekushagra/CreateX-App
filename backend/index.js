const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const commentRoute = require('./routes/comments');

dotenv.config();

const app = express();

// Define CORS options
const corsOptions = {
  origin: 'https://createx-app.onrender.com', // Your production frontend URL
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true // Allow credentials if needed
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions)); // Enable pre-flight request for all routes

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB is connected successfully!");
  } catch (err) {
    console.log(err);
  }
};

// Middlewares
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// Image upload
const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, "images");
  },
  filename: (req, file, fn) => {
  fn(null, file.originalname); // Use the original filename
}

  
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  // console.log(req.body);
  res.status(200).json("Image has been uploaded successfully!");
});

// Start server
app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is running on port " + process.env.PORT);
});
