const User = require('../models/User');
const Team = require('../models/Team');
const { v4: uuidv4 } = require('uuid'); 


// Create a new user
const createUser = async (req, res) => {
    try {
        const { hasTeam, teamName, email, firstName, lastName } = req.body

        const user = new User(req.body);
        await user.save();
        if (hasTeam) {
            // User has a team, so add them to the existing one
            let team = await Team.findOne({ name: teamName });

            if (!team) {
                return res.status(400).json({ message: "Team does not exist. Please check the team name." });
            }

            // Check if the user is already in the team
            if (!team.users.includes(email)) {
                team.users.push(email);
                await team.save();
            }
        } else {
            // User does NOT have a team, so create a new one
            const teamCode = uuidv4().substring(0, 6); // Generate a unique 6-character team code

            const newTeam = new Team({
                name: `${teamName}`, // Custom team name
                code: teamCode,
                users: [email]
            });

            await newTeam.save();
        }

        res.status(201).json({ message: "User created successfully!", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single user
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
