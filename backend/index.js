const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

const authentication = require("./routes/Authentication.js");
const exam = require("./routes/examsetting.js");
const adminRoutes = require("./routes/adminroutes.js");
const studentRoute = require("./routes/studentroutes.js");

dotenv.config();

const __dirname = __dirname; // In CommonJS, __dirname is already available

const app = express();

// ----------------- CORS -----------------
const allowedOrigins = [
  "https://quick-test-platform.vercel.app",
  "http://localhost:4000",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ----------------- Middlewares -----------------
app.use(express.json());

// ✅ Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Static files
app.use(express.static(path.join(__dirname, "public")));

// (Optional) if you want to serve frontend separately
app.use("/frontend", express.static(path.join(__dirname, "..", "frontend")));

// ----------------- Routes -----------------
app.use("/api/authenticate", authentication);
app.use("/api/setExam", exam);
app.use("/api/admin", adminRoutes);
app.use("/api/user", studentRoute);

// ----------------- Health check route -----------------
app.get("/", (req, res) => {
  res.send({
    activeStatus: true,
    error: false
  });
});

// ----------------- MongoDB -----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", (error) => console.error("❌ MongoDB error:", error));
db.once("open", () => console.log("✅ Connected to MongoDB Atlas"));

// ----------------- Start server -----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Listening on port ${PORT}`);
});
