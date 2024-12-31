const express = require("express");
const router = express.Router();
const Record = require("../models/Record");

// Create a record
router.post("/", async (req, res) => {
    const { key, value } = req.body;
  
    if (!key || !value) {
        return res.status(400).json({ error: "Both `key` and `value` are required." });
    }
  
    try {
      const newRecord = new Record({ key, value });
      const savedRecord = await newRecord.save();
      res.status(201).json(savedRecord);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Read all records with sorting and pagination

// http://localhost:5000/api/records?sort=key
// http://localhost:5000/api/records?sort=-createdAt
// http://localhost:5000/api/records?page=1&limit=5&sort=-createdAt

router.get("/", async (req, res) => {
    try {
      const { page = 1, limit = 10, sort } = req.query;
      const skip = (page - 1) * limit;
  
      const sortParams = sort
        ? sort.split(",").reduce((acc, field) => {
            acc[field.replace("-", "")] = field.startsWith("-") ? -1 : 1;
            return acc;
          }, {})
        : {};
  
      const records = await Record.find()
        .sort(sortParams)
        .skip(skip)
        .limit(parseInt(limit));
      res.status(200).json(records);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Update a record by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedRecord = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a record by ID
router.delete("/:id", async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;