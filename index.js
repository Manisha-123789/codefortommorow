const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8000;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
    },
    Email: {
        type: String,
        require: true,
        unique: true
    },
    Password: {
        type: String,
        require: true
    }
});



const User = mongoose.model("codesfortommorow", userSchema);

mongoose
    .connect("mongodb://localhost:27017/codesfortommorow")
    .then(() => console.log("Mongodb Connected Sucessfully"))
    .catch((err) => console.log("Not Connected", err));

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const checktheJWTauthorization = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.json({ message: "Token is not present" });
    }
    jwt.verify(token, "token", (err, user) => {
        if (err) { return res.json({ message: "invalid token" }) };
        req.user = user;
        next();
    });
};

// app.post('/login', async (req, res) => {
// const userEmail = req.body.Email;
// const userPassword = req.body.Password;
//     try {
//         const user = await User.findOne({userEmail});
//         if(!user) return res.status(400).send('User does not exist');
//     } catch (error) {
//         res.send(error);
//     }
// });


//alluser
app.get('/api/alluser', async (req, res) => {
    const alluser = await User.find({});
    return res.json(alluser);
});

//get user details from the serve
app.get('/user/:firstName', async (req, res) => {
    const finduserbyname = req.params.firstName;
    const singleUser = await User.findOne({ firstName: finduserbyname });
    return res.json(singleUser);
});


//login using email and passwrod
app.get('/user/:email/:password', async (req, res) => {
    const userName = req.params.firstName;
    const userPassword = req.params.password;
    const user = await User.findOne({ email: userName });
    if (user != null) {
        if (userPassword != user.Password) {
            return res.json({ status: "Incorrect Password" });
        }
        else {
            return res.json(user);
        }
    }
    else {
        return res.json({ status: "User does not Exist" });
    }
});


//reset password





const transporter = nodemailer.createTestAccount({
    service: 'yahoo',
    auth: {
        user: 'aslaug71@yahoo.com',
        pass: 'saibaba@123'
    },
});

const sendResetPasswordOnMail = (email) => {
    const resetLink = 'http://localhost:8000/updateyourpassword';
    const mail = {
        from: 'aslaug71@yahoo.com',
        to: gmail,
        subject: 'Reset your password',
        text: 'click on the link'
    };
    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendResetPasswordOnMail,
};

//signup api

app.post('/signup', async (req, res) => {
    if (!req.body.firstName ||
        !req.body.Email ||
        !req.body.Password
    ) {
        return res.status(400).send(`Firstname, Email & Password are mandatory`);
    }

    const encryptedpassword = await bcrypt.hash(req.body.Password, 10);
    await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        Email: req.body.Email,
        Password: encryptedpassword
    });
});




app.listen(PORT, () => {
    console.log(`Server has started on this PORT ${PORT}`)
});