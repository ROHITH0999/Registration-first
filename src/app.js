require("dotenv").config()
const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const hbs = require('hbs');
const jwt = require('jsonwebtoken');
require('./DB/conn');
const RegData = require("../src/models/regSchema");
const { log } = require('console');
const Port = process.env.PORT || 3000;


const app = express();


const viewPath = path.join(__dirname, "../templates/views")
const partialPath = path.join(__dirname, "../templates/partials")


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("views", viewPath);
app.set("view engine", "hbs");
hbs.registerPartials(partialPath);

console.log(process.env.SECRET_KEY);


app.get('/', (req, res) => {
    res.render('index');
})

app.get('/register', (req, res) => {
    res.render('register');
})
app.get('/login', async (req, res) => {
    res.render('login');
})


app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, gender, phoneNumber, password, confirmPassword } = req.body;

        if (password === confirmPassword) {
            const data = new RegData(req.body);

            const token = await data.generateToken();
            console.log("token:" + token);

            const userData = await data.save();
            res.status(201).render("index");
        } else {
            res.status(400).send("Passwords do not match");
        }
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(400).send(error);
    }
});

app.post('/login', async (req, res) => {

    try {
        const email = req.body.email;
        const pass = req.body.password;
        console.log(`${email} ${pass}`);

        const data = await RegData.findOne({ email: email })
        const isMatch = await bcrypt.compare(pass, data.password);

        const token = await data.generateToken();
        console.log("token:" + token);

        console.log(isMatch);

        if (isMatch) {
            console.log("Login success");
            res.status(201).render('index');
        }
        else
            res.send("invalid Password");
    } catch (error) {
        res.status(401).send("Invalid Email");
    }
})


// const createToken=async()=>{
//     const token=await jwt.sign({_id:"668410f8aabbd2d64f3ad140"},"helloeveryonemynameisrohithdkvbakvbkjavkjbskvjbkajdvbkjsvbkj",{
//         expiresIn:"2 minutes"
//     });
//     console.log(token);
//     const userVer=await jwt.verify(token,"helloeveryonemynameisrohithdkvbakvbkjavkjbskvjbkajdvbkjsvbkj");
//     console.log(userVer);
// }

// createToken();


app.listen(Port, () => {
    console.log("Connection Connected........")
})