const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      "https://crewholic.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/services");
const otpRoutes = require("./routes/otp");

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/otp", otpRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));