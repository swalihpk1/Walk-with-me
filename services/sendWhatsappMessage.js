
const request = require("request");

const sendWhatsappMessage = (phoneNumber, message) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': 'https://whats-api.rcsoft.in/api/create-message',
            'headers': {
            },
            formData: {
                'appkey': '17481907-51c0-485b-b0f3-11f4f414c1ee',
                'authkey': '4WS10LKGqfq7efxHK3buYg1f50vE3JvHs4nvrjuR0dpn9o3eYl',
                'to': phoneNumber,
                'message': message
            }
        };
        console.log(phoneNumber, message)

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
