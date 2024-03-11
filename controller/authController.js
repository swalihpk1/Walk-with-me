const User = require('../model/user-model');
const bcrypt = require('bcrypt')
const sendWhatsapp = require('../services/sendWhatsappMessage')
const Otp = require('../model/otp-model')

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
        const user = await User.findOne({ mobile: mobile,isVerified:true })
        if (!user) {
            return res.json({ success: false, user: false })
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            req.session.user_id = user._id;
            res.json({ success: true })
        } else {
            res.json({ success: false, user: true });
        }
    } catch (error) {
        console.log("error on handleLogin", error);
        res.status(501).send({ error: error.message })
    }
}

const handleSingUp = async (req, res) => {
    try {
        const { name, mobile, gender, emgNum1, emgNum2, password } = req.body;
        let isUser = await User.findOne({ mobile: mobile, isVerified: true });
        if (isUser) {
            console.log("success:afle")
            return res.json({ success: false })
        }
        if (!name || !mobile || !gender || !emgNum1 || !emgNum2 || !password) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        let user = await User.findOneAndUpdate(
            { mobile: mobile,isVerified:false },
            {
                $set: {
                    name,
                    mobile,
                    gender,
                    emergency_contacts: [
                        emgNum1,
                        emgNum2
                    ],
                    password: hashedPassword,
                    isVerified:true
                }
            },
            { upsert: true,new: true, }
        )
        console.log(user,"*************")
        const otpValue = Math.floor(1000 + Math.random() * 9000);
        await Otp.findOneAndUpdate(
            { user_id: user._id },
            { $set: { otp: otpValue } },
            { upsert: true }
        );
        const otpMessage = `Your WALK WITH ME verification code is *${otpValue}*.\n\nEnter this code to verify your account.\n\nThank you for choosing WALK WITH ME!`;
        sendWhatsapp.sendWhatsappMessage(`91${mobile}`, otpMessage)
        req.session.signup_id = user._id;
        res.json({ success: true })
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
        res.status(500).json({ error: error.message }); ver
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { num1, num2, num3, num4 } = req.body;
        console.log(req.body)
        let enteredOtp = Number(`${num1}${num2}${num3}${num4}`);
        let userId = req.session.signup_id;
        console.log(userId,"userID")
        let isOtpCrct = await Otp.findOne({ user_id: userId, otp: enteredOtp });
        console.log(isOtpCrct)
        if(isOtpCrct){
            if (isOtpCrct.otp === enteredOtp) {
                await User.updateOne({
                    _id:userId
                },{$set:{
                    isVerified:true
                }});
                return res.redirect('/login');
            }
        }
        return res.json({ success: false, message: "otp is incorrect" })
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
    home,
    loadOtpPage,
    verifyOtp,
    loder
}