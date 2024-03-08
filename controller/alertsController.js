const { sendWhatsappMessage } = require("../services/sendWhatsappMessage");

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

module.exports = {
    sendAlertMessages
};
