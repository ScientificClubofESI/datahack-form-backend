const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, unique: true },
    users: [{ type: String, unique: true, sparse: true }]
});

module.exports = mongoose.model('Team', teamSchema);
