
const request = require("request");

const sendWhatsappMessage = (phoneNumber, message) => {
    return new Promise((resolve, reject) => {
       var options = {
          'method': 'POST',
          'url': 'https://whats-api.rcsoft.in/api/create-message',
          'headers': {
          },
          formData: {
         'appkey': 'dd0de7c2-575e-458b-b3b6-a7c6985c5dca',
         'authkey': 'yZWhAmnpu2sJAYw8FYtWB5BBEmKtr5YmGrh12ldXsTEaHEDPCc',
         'to': 'RECEIVER_NUMBER',
         'message': 'Example message'
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
