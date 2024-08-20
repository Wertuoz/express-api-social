const express = require("express");
const router = express.Router();
const multer = require("multer");

const uploadDestination = "uploads";

// Showing where to save files
const storage = multer.diskStorage({
  destination: uploadDestination,
  fileName: (req, file, cb) => {
    cb(null, file.originalName);
  },
});

const uploads = multer({ storage: storage });

router.get("/register", (req, res) => {
  res.send("register");
});

module.exports = router;
