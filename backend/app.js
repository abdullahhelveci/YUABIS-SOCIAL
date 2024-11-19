const express = require("express");
const cors = require("cors");
const app = express();
const postRouter = require("./routes/postRouter.js");
const userRouter = require("./routes/userRouter.js");
const authRouter = require("./routes/authRouter.js");
const multer = require("multer");
const path = require("path");

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const fileName = req.body.name || file.originalname;
    console.log(req.body.name);
    cb(null, fileName);
  },
});
const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json({ message: "file uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

module.exports = app;
