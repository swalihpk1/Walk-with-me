const User = require('../model/user-model');
const bcrypt = require('bcrypt')


const loadLogIn = (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.error("error on loadLogIn", error);
        res.status(401).send({ error: error.message });
    }
}
const loadSignup = (req, res) => {
    try {
        res.render('signup');
    } catch (error) {
        console.log("error on loadSignup", error);
        res.status(501).send({ error: error.message })
    }
}
const home = (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        console.log("error on loadSignup", error);
        res.status(501).send({ error: error.message })
    }
}

const handleLogIn = async (req, res) => {
    try {
        const { mobile ,password} = req.body;
        const user = await User.findOne({ mobile: mobile })
        if (!user) {
            return res.json({ message: "there is no user in that given number" })
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.render('home');
        } else {
            res.status(401).json({ error: "Invalid password." });
        }
    } catch (error) {
        console.log("error on handleLogin", error);
        res.status(501).send({ error: error.message })
    }
}
const handleSingUp = async (req, res) => {
    try {
        const { name, mobile, gender, emgNum1, emgNum2, password } = req.body;
        let isUser = await User.findOne({mobile:mobile});
        if(isUser){
            return res.json({message:"user already there"})
        }
        if (!name || !mobile || !gender || !emgNum1 || !emgNum2 || !password) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let user = new User({
            name,
            mobile,
            gender,
            emergency_contacts: [
                emgNum1,
                emgNum2
            ],
            password:hashedPassword
        })
        await user.save();
        res.json({ message: 'usercreated;' })
    } catch (error) {
        console.log("error on handleLoginIn", error)
        res.status(401).send({ error: error.message })
    }
}


module.exports = {
    loadLogIn,
    handleSingUp,
    handleLogIn,
    loadSignup,
    home
}