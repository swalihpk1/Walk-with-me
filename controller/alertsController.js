const { sendWhatsappMessage } = require("../services/sendWhatsappMessage");
const User = require('../model/user-model')
const sendAlertMessages = async (req, res) => {
    const { to, message } = req.body;
    try {
        const response = await sendWhatsappMessage(to, message);
        console.log(response);
        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
const sendMessages = async (req, res) => {
    try {
        const { message } = req.body;
        console.log(req.body);
        console.log(req.session.user_id);
        const user = await User.findOne({ _id: req.session.user_id }, { emergency_contacts: 1, _id: 0 });
        console.log(user, "user");
        if (user && user.emergency_contacts && user.emergency_contacts.length > 0) {
            for (let contact of user.emergency_contacts) {
                await sendWhatsappMessage(`91${contact}`, message);
            }
            res.json({ message: 'ok' });
        } else {
            console.error("No emergency contacts found for the user");
            res.status(400).json({ error: "No emergency contacts found for the user" });
        }
    } catch (error) {
        console.error("error on send messages", error);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = {
    sendAlertMessages,
    sendMessages
};
