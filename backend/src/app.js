const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const ragRoutes = require("./routes/ragRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/rag", ragRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/consultations", consultationRoutes);

module.exports = app;