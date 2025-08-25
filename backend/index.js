import express from "express"
import mongoose from "mongoose"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors"
import dotenv from "dotenv"

import authentication from "./routes/Authentication.js"
import exam from "./routes/examsetting.js"
import adminRoutes from "./routes/adminroutes.js"
import studentRoute from "./routes/studentroutes.js"

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ----------------- CORS -----------------
const allowedOrigins = ["http://localhost:4000", "http://localhost:3000"];

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
// This serves everything in /backend/public at http://localhost:3000/
app.use(express.static(path.join(__dirname, "public")));

// (Optional) if you want to serve frontend separately
app.use("/frontend", express.static(path.join(__dirname, "..", "frontend")));

// ----------------- Routes -----------------
app.use("/api/authenticate", authentication);
app.use("/api/setExam", exam);
app.use("/api/admin", adminRoutes);
app.use("/api/user", studentRoute);

// ----------------- Default route -----------------
app.get("/", (req, res) => res.render("index1"));
app.get("/", (req, res) => res.render("test1"));
app.get("/", (req, res) => res.render("analysis1"));

// ----------------- MongoDB -----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", (error) => console.error("❌ MongoDB error:", error));
db.once("open", () => console.log("✅ Connected to MongoDB Atlas"));

// ----------------- Start server -----------------
app.listen(3000, () => {
  console.log("✅ Listening on port 3000");
});


/* import express from "express"
import mongoose from "mongoose"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors"
import dotenv from "dotenv"

import authentication from "./routes/Authentication.js"
import exam from "./routes/examsetting.js"
import adminRoutes from "./routes/adminroutes.js"
import studentRoute from "./routes/studentroutes.js"

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// cors before router
const allowedOrigins = ["http://localhost:4000", "http://localhost:3000"];

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

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

// ✅ Now your routes
app.use('/api/authenticate', authentication);
app.use('/api/setExam', exam);
app.use('/api/admin', adminRoutes);
app.use('/api/user', studentRoute);

// Static serving
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use(express.static('public'));

app.get('/', (req, res) => res.render('index1'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", (error) => console.error("❌ MongoDB error:", error));
db.once("open", () => console.log("✅ Connected to MongoDB Atlas"));

app.listen(3000, () => {
    console.log("listening on port 3000");
});
 */