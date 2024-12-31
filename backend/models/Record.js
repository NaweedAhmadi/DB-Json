const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Record", RecordSchema);