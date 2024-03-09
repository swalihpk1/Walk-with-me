
const request = require("request");

const sendWhatsappMessage = (phoneNumber, message) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': 'https://whats-api.rcsoft.in/api/create-message',
            'headers': {
            },
            formData: {
              'appkey': '820a74a6-3c5e-4943-a419-3703be3cd9ae',
              'authkey': 'vweTmUwDFZSD46Z3umCltLk0ewdklZ3UWG5O1rtKSUguVWbbMb',
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
