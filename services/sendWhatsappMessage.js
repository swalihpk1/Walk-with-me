
const request = require("request");

const sendWhatsappMessage = (phoneNumber, message) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': 'https://whats-api.rcsoft.in/api/create-message',
            'headers': {
            },
            formData: {
                'appkey': '12f97448-a532-465d-89e3-889a4caca7f8',
                'authkey': '1WHwnzFPtxluBXzNHbngZSNSBxVxAjCSpMVQKuPXQH216OiTj8',
                'to': phoneNumber,
                'message': message
            }
        };

        request(options, function (error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response.body);
            }
        });
    });
};

module.exports = {
    sendWhatsappMessage
};
