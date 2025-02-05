const User = require('../models/User');
const Team = require('../models/Team');
const { v4: uuidv4 } = require('uuid'); 


// Create a new user
const createUser = async (req, res) => {
    try {
        const { hasTeam ,createTeam, teamCode, teamName, email, firstName, lastName } = req.body;

        const user = new User(req.body);
        await user.save();
       if(hasTeam){
        if (!createTeam) {
            let team = await Team.findOne({ code: teamCode });

            if (!team) {
                return res.status(400).json({ message: "Team not found. Please check the team code." });
            }

            // Check if the user is already in the team
            if (!team.users.includes(email)) {
                team.users.push(email);
                await team.save();
                res.status(201).json({ message: "User added to the team successfully!", user });
            } else {
                res.status(400).json({ message: "User is already in this team." });
            }
        } else {
            const generatedTeamCode = uuidv4().substring(0, 6);  // Unique team code

            const newTeam = new Team({
                name: teamName,  // Team name provided by the user
                code: generatedTeamCode,  // New team code
                users: [email],  // Add user to the team
            });

            await newTeam.save();

            res.status(201).json({ 
                message: "User created successfully, and a new team has been created!",
                user,
                team: newTeam
            });
        }
       }
       else{
        res.status(201).json({ message: "User created successfully!", user });
       }
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
