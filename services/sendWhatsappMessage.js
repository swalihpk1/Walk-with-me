
const request = require("request");

const sendWhatsappMessage = (phoneNumber, message) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': 'https://whats-api.rcsoft.in/api/create-message',
            'headers': {
            },
            formData: {
              'appkey': '8bed1cad-b447-4b99-bd9f-73592d01be69',
              'authkey': 'RjKmMDn3YCig5w69Ut1iUpZke6HbqtM0jbfLtsuAGqqDyvBa6S',
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
