require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Schema
const EnquirySchema = new mongoose.Schema({
  studentName: String,
  parentName: String,
  phone: String,
  className: String,
  message: String,
});

const Enquiry = mongoose.model("Enquiry", EnquirySchema);

// Save Enquiry
app.post("/enquiry", async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);

    await enquiry.save();
    await fetch(
      "https://script.google.com/macros/s/AKfycbywGjfWlFtKc8erkKWhMZFr_p1Eu70BsmwZhPEqi42PKRcP_Ye3NnF3LYT04ZRZ9gs/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: req.body.studentName,
          parentName: req.body.parentName,
          phone: req.body.phone,
          classApplying: req.body.classApplying,
          message: req.body.message,
        }),
      },
    );
    res.send({ success: true });
  } catch (err) {
    res.status(500).send("Error saving enquiry");
  }
});

// View Enquiries
app.get("/get-enquiries", async (req, res) => {
  const data = await Enquiry.find();
  res.json(data);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
