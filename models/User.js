const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },

    skills: { type: String, required: true },
    hackathonsAttended: { type: Number, required: true },
    hackathonsExperience: { type: String, required: true },

    university: { type: String, required: true },
    major: { type: String, required: true },
    degree: { type: String, required: true },
    graduationYear: { type: Number, required: true },

    cv: {type: String},
    github: { type: String },
    kaggle: { type: String },
    linkedin: { type: String },

    hearAboutUs: { type: String, required: true },
    motivation: { type: String, required: true },

    withTeam: { type: String, required: true, default: false },
    teamName: { type: String },
    comment: { type: String }
});

module.exports = mongoose.model('User', userSchema);
