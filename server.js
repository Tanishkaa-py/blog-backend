const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ Routes
const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

// ✅ Server
app.listen(5000, () => console.log("Server running on port 5000"));