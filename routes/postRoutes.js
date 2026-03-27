const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

// 🔹 GET all posts
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// 🔹 CREATE post (with image)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      image: imageUrl,
    });

    const saved = await newPost.save();
    res.json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
    console.log("BODY:", req.body);
    console.log("FILE:", req.file); 
  }
});

// 🔹 DELETE post
router.delete("/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;