
const request = require("request");

const sendWhatsappMessage = (phoneNumber, message) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': 'https://whats-api.rcsoft.in/api/create-message',
            'headers': {
            },
            formData: {
              'appkey': 'd5548137-a4c4-450d-9a89-aefb651e3c59',
              'authkey': 'JkIXGU5wChWuPotlxVksNXMJmshdlHX3ZlLAJJYa3Xs77tPUcF',
              'to':phoneNumber,
              'message': message
            }
          };
        console.log(phoneNumber,message)

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
