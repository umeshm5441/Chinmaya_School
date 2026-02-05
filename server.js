const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Database
const db = new sqlite3.Database("enquiry.db");

db.run(`CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentName TEXT,
  parentName TEXT,
  phone TEXT,
  className TEXT,
  message TEXT
)`);

// API Route
app.post("/enquiry", (req, res) => {
  const { studentName, parentName, phone, className, message } = req.body;

  db.run(
    `INSERT INTO enquiries(studentName,parentName,phone,className,message)
     VALUES(?,?,?,?,?)`,
    [studentName, parentName, phone, className, message],
    function (err) {
      if (err) return res.status(500).send(err);
      res.send({ success: true });
    },
  );
});
app.get("/get-enquiries", (req, res) => {
  db.all("SELECT * FROM enquiries", [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
