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
            return res.json({success:false,user:false })
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.json({succes:true})
        } else {
            res.json({ success: false ,user:true });
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
        console.error("Error on handleSignUp:", error);
        res.status(500).json({ error: error.message });
    }
};
const loadOtpPage = async (req, res) => {
    try {
       res.render('otp');
    } catch (error) {
        console.error("Error on loadOtpPage", error);
        res.status(500).json({ error: error.message });ver
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { num1, num2, num3, num4 } = req.body;
        let enteredOtp = Number(`${num1}${num2}${num3}${num4}`);
        let userId = req.session.signup_id;
        let isOtpCrct = await Otp.findOne({userId:userId,otp:enteredOtp});
        if(isOtpCrct.otp === enteredOtp){
            return res.json({success:true,message:"otp is corrected"});
        }
        return res.json({success:false,message:"otp is incorrect"})
    } catch (error) {
        console.error("Error on verifyOtp:", error);
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    loadLogIn,
    handleSingUp,
    handleLogIn,
    loadSignup,
    home
}