const User = require('../model/user-model');
const bcrypt = require('bcrypt');
const services = require('../services/sendWhatsappMessage');
const Otp = require('../model/otp-model');



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
const home = async(req, res) => {
    try {
        let user = await User.findOne({_id:req.session.user_id})
        res.render('home',{user});
    } catch (error) {
        console.log("error on loadSignup", error);
        res.status(501).send({ error: error.message })
    }
}
const loder = (req, res) => {
    try {
        res.render('loder');
    } catch (error) {
        res.status(501).send({ error: error.message })
    }
}

const handleLogIn = async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const user = await User.findOne({ mobile: mobile })
        if (!user) {
            return res.json({ message: "there is no user in that given number" })
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            req.session.user_id = user._id;
            res.render('home');
        } else {
            res.status(401).json({ error: "Invalid password." });
        }
    } catch (error) {
        console.log("error on handleLogin", error);
        res.status(501).send({ error: error.message })
    }
}
const handleSignUp = async (req, res) => {
    try {
        const { name, mobile, gender, emgNum1, emgNum2, password } = req.body;
        let isUser = await User.findOne({ mobile: mobile, isVerified: true });
        if (isUser) {
            return res.json({ message: "User already exists." });
        }

        if (!name || !mobile || !gender || !emgNum1 || !emgNum2 || !password) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let user = new User({
            name,
            mobile,
            gender,
            emergency_contacts: [emgNum1, emgNum2],
            password: hashedPassword,
            isVerified: false,
        });
        req.session.signup_id = user._id;
        await user.save();

        const otpValue = Math.floor(1000 + Math.random() * 9000);
        await Otp.findOneAndUpdate(
            { user_id: user._id },
            { $set: { otp: otpValue } },
            { upsert: true }
        );
        const whatsappMessage = `Security Alert!\n\
        Dear WALK WITH ME user,\n
        We're here to ensure your safety and security. Your one-time verification code for the WALK WITH ME application is *${otpValue}*.
        Please enter this code to confirm your identity and continue your journey with us. `;
        await services.sendWhatsappMessage(`91${mobile}`, whatsappMessage);
        res.json({ message: 'User created successfully. OTP sent.' });
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
    handleSignUp,
    handleLogIn,
    loadSignup,
    home,
    loadOtpPage,
    verifyOtp,
    loder
}