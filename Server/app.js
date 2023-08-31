const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
// Load environment variables
dotenv.config();

const app = express();

const corsOpts = {
  origin: true,
  credentials: true,
  preflightContinue: true,
  methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Type"],
};

// Middleware
app.use(cors(corsOpts));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Routes
app.use("/api", require("./routes"));
app.use(express.static(__dirname + "/../LEVEL"));
// app.use(express.static(path.join(__dirname, '/../LEVEL'), {
//   setHeaders: (res, path, stat) => {
//     if (path.endsWith('.js')) {
//       res.setHeader('Content-Type', 'application/javascript');
//     } else if (path.endsWith('.css')) {
//       res.setHeader('Content-Type', 'text/css');
//     }
//   }
// }));

app.get("/", (req, res) => {
  try {
    res.sendFile(path.join(__dirname + "/../LEVEL/front_page.html"));
  } catch (error) {
    console.error("Error sending file:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/login", (req, res) => {
  try {
    res.sendFile(path.join(__dirname + "/../LEVEL/login.html"));
  } catch (error) {
    console.error("Error sending file:", error);
    res.status(500).send("Internal Server Error");
  }
});

// app.get("/loginjs", (req, res) => {
//   try {
//     res.sendFile(path.join(__dirname + "/../LEVEL/login.js"));
//   } catch (error) {
//     console.error("Error sending file:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
// app.get("/logincss", (req, res) => {
//   try {
//     res.sendFile(path.join(__dirname + "/../LEVEL/login_css.css"));
//   } catch (error) {
//     console.error("Error sending file:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.get("/levelpage", (req, res) => {
  try {
    res.sendFile(path.join(__dirname + "/../LEVEL/Levelpage.html"));
  } catch (error) {
    console.error("Error sending file:", error);
    res.status(500).send("Internal Server Error");
  }
});
// app.get("/levelpagejs", (req, res) => {
//   try {
//     res.sendFile(path.join(__dirname + "/../LEVEL/levelControl.js"));
//   } catch (error) {
//     console.error("Error sending file:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
// app.get("/levelpagecss", (req, res) => {
//   try {
//     res.sendFile(path.join(__dirname + "/../LEVEL/levelpage_css.css"));
//   } catch (error) {
//     console.error("Error sending file:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
app.get("/intropage", (req, res) => {
  try {
    res.sendFile(path.join(__dirname + "/../LEVEL/intropage.html"));
  } catch (error) {
    console.error("Error sending file:", error);
    res.status(500).send("Internal Server Error");
  }
});

// app.use(express.static(__dirname + "/../build"));
app.get("/level", (req, res) => {
  try {
    res.sendFile(path.join(__dirname + "/../LEVEL/level.html"));
  } catch (error) {
    console.error("Error sending file:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/level/:id", (req, res) => {
  try {
    res.sendFile(path.join(__dirname + "/../LEVEL/level.html"));
    res.redirect(`/level?number=` + req.params.id);
  } catch (error) {
    console.error("Error sending file:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
