
// Create a new user
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Team = require('../models/Team');
const { error } = require('console');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'ly_zaidi@esi.dz',
        pass: process.env.APP_EMAIL_PASSWORD, // Utilisez un mot de passe d'application
    },
    secure: true,
    port: 465  ,
    tls: {
        rejectUnauthorized: false
    }
});

const createUser = async (req, res) => {
    try {
        const { hasTeam, createTeam, teamCode, teamName, email, firstName, lastName } = req.body;
      
        // Create the user first
        const user = new User(req.body);
        await user.save();

        let team = null;

        if (hasTeam) {
            if (!createTeam) {
                // User wants to join an existing team
                team = await Team.findOne({ code: teamCode });

                if (!team) {
                    return res.status(400).json({ message: "Team not found. Please check the team code." });
                }

                // Add user to the team if not already present
                if (!team.users.includes(email)) {
                    team.users.push(email);
                    await team.save();
                }
               
            } else {
                // User is creating a new team
                const generatedTeamCode = uuidv4().substring(0, 6); // Unique team code

                team = new Team({
                    name: teamName,
                    code: generatedTeamCode,
                    users: [email],
                });

                await team.save();
              
            } 
        } 
        
        const emailSubject = "[DATAHACK] Registration Successful!";
        const emailBody =  `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="Content-Type" content="text/html;">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta name="x-apple-disable-message-reformatting">
                    <title>CSE email template</title>
                    <style>
                        u > #cont {
                            background-image: linear-gradient(0deg, black, black); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                        }
                    </style>
                </head>
                <body class="body" style="margin: 0; padding: 0; height: 100%; width: 100%; background-repeat: no-repeat; background-position: center;">
                    <center class="wrapper" style="width: 100%; table-layout: fixed; position:center">
                        <div class="webkit" style="width: 100%; max-width: 760px; z-index: -s10; margin: auto; overflow-x: hidden; position: relative; border-spacing: 0;  background-size: cover; background-repeat: no-repeat; background-image: url('https://drive.google.com/uc?id=1-wTDW8u1u_DqvcJ0gxUFoyxL8q4lVVvc');">
                            <table class="outer" align="center" style="width: 100%; max-width: 760px; color: white; border-spacing: 0; padding-top: 20px; padding-bottom: 20px; padding-left: 5%; padding-right: 8%; font-family: 'Work Sans', sans-serif; position: relative;" width="760" background="url('https://drive.google.com/uc?id=1ybwtcIDOk0qJ3698_kxks-3r3sakKBSp')">
                                <tbody style="font-family: 'Raleway', sans-serif;">
                                    <tr>
                                        <td align="center" style="padding: 0;">
                                            <table style="width: 100%; max-width: 600px; margin: 0 auto;">
                                                <tr>
                                                    <td style="width: 40%; text-align: center;">
                                                        <img src="https://drive.google.com/uc?id=10JhaA9QGEugW-nVNQbFNwhbx7zWvIEy9" alt="cse-logo" style="border: 0; max-width: 200px; width: 100%;">
                                                    </td>
                                                    <td style="width: 40%; text-align: center;">
                                                        <img src="https://drive.google.com/uc?id=1NO4sLSYhhFj1T4Fs2IhWjscsr62Vkz8a" alt="cse-logo" style="border: 0; max-width: 200px; width: 100%;">
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 0; padding-top: 40px; line-height: 20px; font-weight: 400; font-size: 16px;">
                                            <div id="cont" style="">
                                                <span style="display: block; margin-bottom: 10px; font-weight: 700; font-family: 'Inter', sans-serif; font-size:larger;">DataHack 2025 Registration Confirmation ,</span>
                                                ${!hasTeam ? 'Your registration has been successfully created. Stay tuned for the acceptation result!'
                        :
                        `Thank you for registering to DataHack 2025! Your registration has been successfully created with the team <b> ${team.name} </b> <br/><br/>
                                                Your team code is :`}
                                            </div>
                                        </td>^
                           
                                    ${!hasTeam ? '' : `
                                    <tr>
                                        <td style=" padding: 0; padding-top: 20px; font-weight: 400; font-size: 16px; line-height: 20px; text-align: center;">
                                           
                                      
                                                <b style="font-size: x-large;  ">  ${team.code} </b> <br/><br/>
                                         
                                     
                                              
                                        </td>
                                    
                                      
                                    </tr>
                                    `}
            
                                    ${!hasTeam ? '' : `
                                    <tr>
                                        <td style=" padding: 0; padding-top: 20px; font-weight: 400; font-size: 16px; line-height: 20px; ">
                                           
                                      
                                            Please share this code with the rest of your team<br> Stay tuned for the acceptation result! <br/>
                                     
                                 
                                          
                                        </td>
                                    </tr>
                                    `}
                                    <tr>
                                        <td align="center" style="padding: 0; padding-top: 40px;">
                                            <img src="https://drive.google.com/uc?id=1o_Z33b9q-VXJ2FrocC0oE4D0Qb1YWL0a" alt="CSE log" style="border: 0; display: block;">
                                            <p style="font-weight: 600; font-family: 'Work Sans', sans-serif; font-size: 14px;">CSE Club scientifique de l&apos;ESI </p>
                                            <p style="font-weight: 400; font-size: 10px; font-family: 'Work Sans', sans-serif;">Ecole Nationale Supérieure d&apos;Informatique. -ex INI.</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </center>    
                </body>
            </html>` 


    // Send the email and wait for completion
        await transporter.sendMail(
        { to: email,
        subject: emailSubject,
        html:`<strong>Hello,</strong> ${emailBody}`,}).then(()=> {
            console.log("tout va bien")
        }).catch(error=>{
            console.log(error)
        })
          
        return res.status(201).json({
            message: `User created successfully, and a ${createTeam ? 'new team has been created!' : 'user has been added to the team!'}`,
            user,
    });
     
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }

};

module.exports = { createUser };


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
