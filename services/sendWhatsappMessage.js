
const request = require("request");

const sendWhatsappMessage = (phoneNumber, message) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': 'https://whats-api.rcsoft.in/api/create-message',
            'headers': {
            },
            formData: {
              'appkey': '19639dad-ed9a-443d-99b8-109214637982',
              'authkey': 't776EID8ysP7Lyj0JuIqWUbrGuoDARPCzsNcQHRxHRqHXehxfd',
              'to': phoneNumber,
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
